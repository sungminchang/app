module.requires = [
    { name:'instance.form.validate.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var msgonevent,
        events = app['core.events'],
        language = app['core.language'],

    a = function(o) {
        this.form = o.form;
        this.routine = o.routine;
        this.eventListeners = [];
        this.messageOutputs = [];
        this.init();
    };

    a.prototype.clear = function() {
        if (msgonevent) 
            events.remove(msgonevent,'core.language','code.set');
        this.messageOutputs.forEach(function (o) {
            o.parentNode.removeChild(o);
        });
        this.messageOutputs=[];
        Array.prototype.slice.call(this.form.elements).forEach(function(o) {
            o.className = o.className.replace(" validation-fail","");
        });
    };

    a.prototype.init = function() {
        var self = this,
            form = this.form;
        if (form.className.indexOf('instance-form-validate') === -1) 
            form.className += ' instance-form-validate';
        var f = function() {
            self.clear();
            var k = self.routine();
            if (! k) 
                return;
            var n = k.near,
                t = document.createElement('div');
            n.className += ' validation-fail';
            n.parentNode.style.position='relative';
            t.className='validation-message';
            t.style.left=n.offsetLeft + 'px';
            t.style.top= (n.offsetHeight+n.offsetTop) + 'px';
            msgonevent = function() { 
                t.innerHTML = language.mapKey(k.message);
            };
            msgonevent();
            events.on('core.language','code.set', msgonevent);
            n.parentNode.appendChild(t);
            self.messageOutputs.push(t);
        };
        this.eventListeners.forEach(function(o) {
            try { 
                o[0].removeEventListener(o[1],o[2],false); 
            }
            catch (e) {

            }
        });
        Array.prototype.slice.call(form.elements).forEach(function(o) {
            var t = 'oninput' in o? 'input' : 'change',
                g = o.addEventListener(t, function() { f(); });
            self.eventListeners.push(o,t,g);
        });
        this.eventListeners.push(form,'submit',form.addEventListener('submit', function() { f(); }));
    };

    return a;

};