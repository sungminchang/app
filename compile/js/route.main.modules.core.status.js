module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var data = {

            desc : {
                en : 'A very simple status event emitter.',
                fr : 'Un émetteur très simple d\'événement d\'état.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'append', 
                    type:'function',
                    attributes: [
                        { 
                            type:'object', 
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'Object to pass onto the event handler.',
                                    fr : 'Le code de match.'
                                }
                            }]
                        }
                    ]
                }
            ],
            related : [
                'service.status.js'
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};