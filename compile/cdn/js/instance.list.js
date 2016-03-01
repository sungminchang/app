//# sourceURL=instance.list.js

module.requires = [
    { name: 'core.language.js' },
    { name: 'instance.list.css' }
];

module.exports = function(app) {

    "use strict";

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

/*------------------------------------------------------------------------------------------------*/

    /* Item
     * @constructor
     * @param {object} o - config literal
     */
    var InstanceListItem = function(o) {

        this.name = 'item';
        this.container = function(dom) {

            return dom.mk('li',o.parent,o.content,o.className);
        };
        bless.call(this,o);
    };

/*------------------------------------------------------------------------------------------------*/

    /* List
     * @constructor
     * @param {object} o - config literal - see online help for attributes
     */
    var InstanceList = function(o) {

        o = o || {};
        this.name='instance.list';
        this.asRoot=true;
        this.container=function(dom) {

            return dom.mk('ol',o,null,o.className);
        };
        this.children = {
            items:'item'
        };
        bless.call(this,o);
    };

    /* Async constructor
     * @param {object} o - config literal - see online help for attributes
     * @returns {Promise}
     */
    InstanceList.prototype.init = function(o) {

        if (o && o.items)
            return this.addItems(o.items);
    };

    /* Adds multiple items
     * @param {Array} o - items to add
     * @returns {Promise}
     */
    InstanceList.prototype.addItems = function(o) {

        var self = this;
        return object.promiseSequencer(o,function(a) {

            return self.addItem(a);
        });
    };

    /* Adds multiple items
     * @param {Array} o - items to add
     * @returns {Promise}
     */
    InstanceList.prototype.addItem = function(o) {

        o = o || {};
        o.parent = this;
        var listItem = new InstanceListItem(o);
        arrayInsert(this.items,listItem,o);
        return this.managers.event.dispatch('addItem',listItem).then(function() {

            return listItem;
        });
    };

    /* Clear all items
     * @returns {Promise}
     */
    InstanceList.prototype.clear = function() {

        return Promise.all([
            this.items.slice(0).map(function (o) {

                return o.destroy();
            })
        ]);
    };

    /* Shifts and item up/down the array
     * @param {InstanceListItem} listItem - to move
     * @param {number} places - to move up/down by
     * @returns {Promise}
     */
    InstanceList.prototype.shift = function(listItem,places) {

        if (! (listItem instanceof InstanceListItem))
            throw new TypeError("First argument must be instance of InstanceListItem");

        if (typeof places !== 'number')
            throw new TypeError("Second argument must be of type number");

        var items = this.items,
            c = this.container,
            li = o.container,
            i = items.indexOf(listItem);

        if (i === -1)
            throw new Error("InstanceListItem not within InstanceList pool");

        if (places+i >= items.length) {
            places += i;
            while (places >= 0) {
                places -= items.length;
            }
            --places;
        }

        if (li.parentNode)
            c.removeChild(li);

        items.splice(i+places,0,items.splice(i,1)[0]);
        i = items.indexOf(listItem);

        if (i === items.length-1) {
            c.appendChild(li);
        } else {
            c.insertBefore(li,items[i+1].container);
        }

        return this.managers.event.dispatch('shift',listItem);
    };

    return InstanceList;
};
