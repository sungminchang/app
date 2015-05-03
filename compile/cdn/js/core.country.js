(function() {

'use strict';

module.requires = [
    { name:'core.store.js' },
    { name:'core.url.js' }
];

module.exports = function(app, params) {

    var store = app['core.store'],
        url = app['core.url'],
        bless = app['core.object'].bless;

    var detect = function() {
        var n = window.navigator.userLanguage || window.navigator.language;
        if (n.length > 3) 
            n=n.substr(3);
        return country.managers.store.get('env').then(function (stored) {
            return [
                stored,
                params.appconf.localeCountry,
                url.getParam('localeCountry'),
                n,
                'US'
            ].reduce(
                function(a,b,i) {
                    return a.then(function() {
                        return country.setEnv(b,true).then(
                            function() {
                                country.isAuto = i !== 0;
                                throw null;
                            },
                            function () {}
                        );
                    }); 
                },
                Promise.resolve()
            ).then(
                function () {
                    throw new Error('Country failed to set');
                },
                function() { }
            );
        });
    };

    var country = {

        name:'core.country',
        managers : {
            store : store
        },
        env : null,
        isAuto : null,
        pool : {},

        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },

        setEnv : function(id,noStore) {
            var self = this,
                managers = self.managers;
            return new Promise(function (resolve) {
                if (! self.pool[id]) 
                    throw new Error('Code is not in pool.');
                self.env = id;
                if (! noStore)
                    self.isAuto = false;
                return Promise.all([ noStore? null : managers.store.set('env',id)]).then(function() {
                    return managers.event.dispatch('setEnv',id);
                }).then(resolve);
            });
        },

        reset : function() {
            var self = this;
            return this.managers.store.set('env').then(function() {
                self.isAuto = true;
                return detect();
            });
        },

        getFromPoolById : function(id) {
            return this.pool[id.toUpperCase()];
        }
    };

    bless.call(country);

    country.managers.event.on('setPool', function() {
        return detect();
    });

    return country;

};

})();