//# sourceURL=route.main.bless.js

module.requires = [
    { name: 'route.main.bless.css' }
];

module.exports = function(app) {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            objectMgr = managers.object,
            domMgr = managers.dom,
            dom = app['core.dom'];

        model.stash.title=_tr("Bless");
        model.stash.description=_tr("Igaro App's bless decorates standard JavaScript objects. It provides event management, managers, dependency tracking and common functions.");

        domMgr.mk('p',wrapper,_tr("Igaro App's bless decorates standard JavaScript objects. It provides event management, managers, dependency tracking, shared routines and boilerplate. Objects usually bless themselves, and in Igaro App most objects are blessed."));
        domMgr.mk('h1',wrapper,_tr("Usage"));
        domMgr.mk('p',wrapper,_tr("Blessing an object is accomplished with a single call to a function held on the <b>core.object</b> module. Most configuration attributes are held within an argument, while a few can be pre-set prior to call."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"var myWidget = function(o) {\
\n\
\n   this.name = 'instance.mywidget';\
\n   this.container = function(dom) {\
\n        return dom.mk('div',o.container,null,o.className);\
\n   };\
\n   app['core.object'].bless.call(this,o);\
\n}"));

        domMgr.mk('p',wrapper,_tr("In the above example the object is given a namespace of <b>instance.mywidget</b>. This is used by several managers such as for events as they fire up the chain."));
        domMgr.mk('p',wrapper,_tr("In front-end programming the structure of JavaScript objects usually represents a DOM element and it's child elements. Bless offers automatic creation and destruction of DOM elements <b>without</b> having to re-render a container. This strong coupling makes it significantly faster than other frameworks you may have experience with, such as Angular or React."));
        domMgr.mk('p',wrapper,_tr("The power of bless will quickly become apparent. Imagine an object containing an array of child objects. When a child is destroyed it must be removed from the parent array. Bless does this for you."));

        return objectMgr.create('accordion', {
            sections : [
                {
                    title:_tr("Parent"),
                    content:_tr("A reference to a parent object is stored on the child (while this introduces a circular dependency, it's taken care of when the object destructs).")
                },
                {
                    title:_tr("Name"),
                    content:_tr("An object is given a name which can be used to uniquely identify it or it's type. Not to be confused with instanceof!")
                },
                {
                    title:_tr("Path"),
                    content:_tr("A path is used to identify the objects location by way of it's hierarchical position. It's built using the name. Although an object may belong to another it's path may stop at the child, it doesn't necessarily have to resolve all the way to root. This is one usage of the .asRoot flag.")
                },
                {
                    title:_tr("Stash"),
                    content:_tr("Holds data that may not be attributes of the object.")
                },
                {
                    title:_tr("Managers"),
                    content:_tr("A manager is a module that uses the blessed decorations to enhance it's functions and/or to provide helper functions linking the blessed object as a dependency. Common managers include events, debugging, object creation and dom. Additional managers can be supplied at time of blessing, i.e if the module requires a store. Any module can offer a manager.")
                },
                {
                    title:_tr("Helpers"),
                    content:_tr("If a container is provided, helpers will be added to the object. These include show/hide and disable/inert.")
                },
                {
                    title:_tr("Destructor"),
                    content:_tr("A destructor is appended which when called will wipe dependencies, circular references, children, dom elements and events and will fire an event allowing dependents to do the same.")
                }
            ]
        }).then(function(accordion) {
            var domMgr = accordion.managers.dom;
            domMgr.mk('h1',wrapper,_tr("Provides"));
            domMgr.mk('p',wrapper,_tr("The features blessed to an object depend upon the configuration pre-set and passed. The more common attributes are described below."));
            dom.append(wrapper,accordion);
            domMgr.mk('p',wrapper,null,function() {

                domMgr.mk('button',this,_tr("Next Chapter - Async")).addEventListener('click',function() {

                    model.parent.to(['async']);
                });
            });
        });

    };

};
