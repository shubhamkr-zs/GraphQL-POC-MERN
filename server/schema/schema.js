//Mongoose Models
const Project = require('../models/project');
const Client = require('../models/client');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType, GraphQLError} = require('graphql');
const { resolve } = require('path');

// client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString}, 
        phone: { type: GraphQLString}
    })
})


// Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields:() => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        status: { type: GraphQLString},
        clientId: { type: GraphQLID },
        client: { 
            type: ClientType,
            resolve(parent, args){
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: { 
            type: new GraphQLList(ProjectType),
            resolve(parent) {
                return Project.find();
            }
        },
        project: { 
            type: ProjectType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id)
            }
        },
        clients:{ 
            type: new GraphQLList(ClientType),
            resolve(parent){
                return Client.find()
            }
        },
        client: { 
            type: ClientType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
                return Client.findById(args.id)
            }
        }
    }
})

// Mutations

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
//Add Client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,

                })
                return client.save();
            }
        },
    // Delete Client
        deleteClient:{
            type: ClientType,
            args: {
                id: {type:  GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Client.findByIdAndRemove(args.id);
            }
        },
    //Add Project
        addProject:{
            type: ProjectType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString) },
                description: {type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'todo'},
                            'progress': {value: 'In Progress'},
                            'done': {value: 'Completed'}
                        }
                    }),
                    defaultValue: 'todo'
                },
                clientId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parne, args){
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return project.save()
            }
        },
        //Delete PRoject
        deleteProject:{
            type: ProjectType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return Project.findByIdAndRemove(args.id)
            }
        },
        //Update  project
        // update is prettry much the same like create one just the args can be 
        updateProject:{
            type: ProjectType,
            args:{
                id: {type: GraphQLNonNull(GraphQLID) },
                name: {type: GraphQLString },
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': {value: 'todo'},
                            'progress': {value: 'In Progress'},
                            'done': {value: 'Completed'}
                        }
                    })
                },
                clientId: {type: GraphQLID}
            },
            resolve(parne, args){
                const project = new Project({
                    
                })
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId
                        }
                    },
                    {new:true}
                )
            }
        }



}
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})





// Resolvers

// const singleResolver = (array, id) => {
//     return array.find(element => element.id === id)
// }

// const allResolver = (array)=>{
//     return array
// }