var mongoose = require('mongoose');

const DB_NAME = "MongoDB";

describe("MongoDBAdapter", () => {
  
  const DB = require("../../index.js").DB;
  const Entity = require('../../index.js').Entity;

  class Post extends Entity {
      static get schema(){
          return {
              title: {
                  type : String,
                  null : false,
                  default : "Untitled"
              },
              content: String,
              active : {
                type : Boolean,
                default : true
              },
              creation_date : Date,
              update_date : Date
          }
      }
  }

  beforeAll(async () => {

      DB.configure({
          db : {
              type : "mongodb",
              client : await mongoose.connect("mongodb://localhost:27017/omn", {
                  autoReconnect: true,
                  socketTimeoutMS: 300000,
                  connectTimeoutMS: 300000,
                  keepAlive: true,
                  reconnectTries: 30,
                  reconnectInterval: 3000,
              })
          }
      });
          
  });

  it(`should save an instance of Entity with ${DB_NAME} as a database`, async () => {

    const post = new Post({
        title: "A post",
        content: "Lorem ipsum dolor sit amet",
        creation_date: (new Date()).toISOString(),
        update_date: new Date().toISOString()
    });

    await post.save();

    expect(post).toHaveProperty("_id");
    expect(post).toHaveProperty("title", "A post");
    expect(post).toHaveProperty("content", "Lorem ipsum dolor sit amet");
    expect(post).toHaveProperty("creation_date");
    expect(post).toHaveProperty("update_date");

  });

  it(`should read an instance of the Entity inherited class with ${DB_NAME} as a database`, async () => {

    const post = new Post({
      title: "A post",
      content: "Lorem ipsum dolor sit amet",
      creation_date: (new Date()).toISOString(),
      update_date: new Date().toISOString()
    });

    await post.save();

    const postRead = await Post.read(post.id);

    expect(postRead).toHaveProperty("_id", post.id);
    expect(postRead).toHaveProperty("title", post.title);
    expect(postRead).toHaveProperty("content", post.content);
    expect(postRead).toHaveProperty("creation_date", post.creation_date);
    expect(postRead).toHaveProperty("update_date", post.update_date);

  });

  it(`should delete an instance of the Entity inherited class with ${DB_NAME} as a database`, async () => {

    const post = new Post({
      title: "A post",
      content: "Lorem ipsum dolor sit amet",
      creation_date: (new Date()).toISOString(),
      update_date: new Date().toISOString()
    });

    await post.save();
    expect(post).toHaveProperty("_id", post.id);

    await Post.delete(post.id);
    let postRead = await Post.read(post.id);
    expect(postRead).toBeNull();
    
  });
  
});