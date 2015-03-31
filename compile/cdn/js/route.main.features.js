module.requires = [
    { name: 'route.main.features.css' },
    { name: 'core.language.js' },
    { name: 'core.currency.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            currency = app['core.currency'];

        model.setMeta('title', _tr('Features'));

        var managers = model.managers,
            domMgr= managers.dom,
            debugMgr = managers.debug,
            objectMgr = managers.object;
        
        domMgr.mk('p',wrapper,_tr("Igaro's architecture is build around several core principles, these provide a layer on which everything else is built;"));

        domMgr.mk('p',wrapper,domMgr.mk('ul',null,[
           domMgr.mk('li',null,_tr("Javascript is a prototypal language. It's not Java and shouldn't be written to mimick it.")), 
           domMgr.mk('li',null,_tr("HTML is a weak design language ill suited for dynamic operation. Therefore, use no HTML.")), 
           domMgr.mk('li',null,_tr("Child objects should report to parents. Events should fire up a chain.")),
           domMgr.mk('li',null,_tr("The Javascript specification must be adhered to. No functional duplicity or prototyping onto internal objects.")), 
           domMgr.mk('li',null,_tr("Functions have the potential to be asynchronous, or emit an event which may be so, therefore they should return Promises.")) 
        ]));

        domMgr.mk('p',wrapper,_tr("These principles result in;"));

        domMgr.mk('p',wrapper,domMgr.mk('ul',null,[
           domMgr.mk('li',null,_tr("Flexability - expand on functions without rewriting them.")), 
           domMgr.mk('li',null,_tr("Design - built on DOM manipulation, not HTML and hackwork.")), 
           domMgr.mk('li',null,_tr("Encapsulation - code is compartmentalized.")),
           domMgr.mk('li',null,_tr("Security - no memory leaks or public variables.")), 
           domMgr.mk('li',null,_tr("Resilience - smart error control, reporting, debugging and recovery.")),
        ]));

        domMgr.mk('h1',wrapper,_tr("Goals"));

        domMgr.mk('p',wrapper,null,function() {

            objectMgr.create('table', { 
                container:this,
                header : {
                    rows : [
                        {
                            columns : [
                                {
                                    content : _tr("Domain")
                                },
                                {
                                    content : _tr("Details")
                                },
                                {
                                    content : _tr("Status")
                                }
                            ]
                        }
                    ]
                },
                body : {
                    rows : [
                        {
                            columns : [
                                {
                                    content : _tr("Security")
                                },
                                {
                                    content : _tr("No public variables. Military-grade security. No memory leaks. Automatic oAuth initilization with Promise replay.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Locale")
                                },
                                {
                                    content : _tr("Multi-language support via PO files. Realtime language switching. Multi-currency, date w/offset, and country functionality.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Testing")
                                },
                                {
                                    content : _tr("Automated test suite exhaustively testing all features across all modules.")
                                },
                                {
                                    className : 'red'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Performance")
                                },
                                {
                                    content : _tr("Zero DOM parsing, reliance on third party code. Latest Javascript techniques.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Dynamic")
                                },
                                {
                                    content : _tr("Expandable with modules. Decoupled architecture based on events.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Multtasking")
                                },
                                {
                                    content : _tr("Fully asychronous using Promises and no callbacks.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Lazy Loading")
                                },
                                {
                                    content : _tr("Modules and API data can be preloaded or loaded on demand.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        },
                        {
                            columns : [
                                {
                                    content : _tr("Debugging")
                                },
                                {
                                    content : _tr("Dumps data and stacktrace in debug mode. Reports Home in deploy mode.")
                                },
                                {
                                    className : 'green'
                                }
                            ]
                        }
                    ]
                }
            }).catch(function (e) {
                return debugMgr.handle(e);
            });

        });

        domMgr.mk('h1',wrapper,_tr("Widgets"));
        domMgr.mk('p',wrapper,_tr("This framework comes with the kitchen sink!"));
        domMgr.mk('p',wrapper,_tr("Below is  a sample, you'll find a complete list on the module page (instance.* files)."));
        domMgr.mk('h2',wrapper,_tr("Same Space"));
        domMgr.mk('p',wrapper,_tr("This example displays elements in the same space using CSS3 effects to transition between each space. It's great for slideshows!"));

        return model.addSequence({
            container:wrapper,
            promises:[

                objectMgr.create(
                    'samespace',
                    {
                        spaces:[0,1,2].map(function(x,i) { return { id:'a'+i }; }),
                        effect:'fade'
                    }
                ),

                objectMgr.create('xhr').then(function(xhr) {
                    var container = document.createDocumentFragment(),
                        domMgr = xhr.managers.dom;
                    domMgr.mk('h2',container,'AJAX (XHR)');
                    domMgr.mk('p',container,_tr("This example contacts the Youtube API, which returns JSON. From it three videos are loaded. Enjoy the great music!"));
                    domMgr.mk('button',container,_tr("Fetch")).addEventListener('click', function() {
                        var self = this;
                        xhr.get({
                            res:'http://gdata.youtube.com/feeds/users/JustinBieberVEVO/uploads?alt=json&format=5&max-results=3'
                        }).then(
                            function(data) {
                                domMgr.mk('iframe',null,null,function() {
                                    this.className = 'youtube';
                                    var playlist = data.feed.entry.map(function(o) { 
                                        return o.id.$t.substring(38); 
                                    });
                                    this.src = 'http://www.youtube.com/embed/'+playlist[0]+'?wmode=transparent&amp;HD=1&amp;rel=0&amp;showinfo=1&amp;controls=1&amp;autoplay=0;playlist='+playlist.slice(1).join(',');
                                    self.parentNode.insertBefore(this,self);
                                });
                                domMgr.rm(self);
                            }
                        ).catch(function() { 
                            model.managers.debug.handle(e);
                        });
                    });
                    return container;
                }),

                objectMgr.create('form.validate').then(function(formValidate) {
                    var container = document.createDocumentFragment(),
                        managers = formValidate.managers,
                        domMgr = managers.dom,
                        objectMgr = managers.object,
                        debugMgr = managers.debug;
                    domMgr.mk('h2',container,_tr("Form Validation"));
                    domMgr.mk('p',container,_tr("Try entering an invalid currency denomination into the box below."));
                    domMgr.mk('form',container,null,function() {
                        this.className = 'currencycheck';
                        formValidate.setForm(this);
                        domMgr.mk('label',this,_tr("Deposit"));
                        var v = domMgr.mk('input[text]',this,null,function() {
                            this.placeholder='xx.xx'; 
                            this.name='amount';
                            this.required = true;
                        }),
                            form = this;
                        domMgr.mk('input[submit]',this,_tr("Transfer"));
                        formValidate.rules = [
                            [
                              'amount', 
                              function(v) {
                                  if (! currency.validate(v))  
                                    return _tr("Invalid amount");
                                  if (v === 0)
                                    return _tr("Must be positive");
                              }
                            ]
                        ];
                        this.addEventListener('submit',function() {
                            v.value='';
                            return objectMgr.create('toast',{
                                message: _tr("Transaction Successful")
                            }).catch(function (e) {
                                return debugMgr.handle(e);
                            });
                        });
                    });
                    return container;
                }),

                objectMgr.create('rte').then(function(rte) {
                    var container = document.createDocumentFragment(),
                        domMgr = rte.managers.dom;
                    domMgr.mk('h2',container,_tr("Rich Text Editor"));
                    domMgr.mk('p',container);
                    container.appendChild(rte.container);
                    return container;
                }),

                objectMgr.create('accordion', {
                    sections : [
                        {
                            title:_tr("Suppliers"),
                            content:_tr("Acme Ltd is bankrupt.")
                        },
                        {
                            title:_tr("Contractors"),
                            content:_tr("Don is off sick, again.")
                        },
                        {
                            title:_tr("Materials"),
                            content:_tr("Were stolen yesterday evening.")
                        }
                    ]
                }).then(function(accordion) {
                    var container = document.createDocumentFragment(),
                        managers = accordion.managers,
                        domMgr = managers.dom,
                        eventMgr = managers.event;
                    domMgr.mk('h2',container,_tr("Accordion"));
                    domMgr.mk('p',container,_tr("Accordions are a great way to condense information into a navigatable form."));
                    domMgr.mk('p',container);
                    container.appendChild(accordion.container);
                    return container; 
                }),

            ]
        });

    };

};
