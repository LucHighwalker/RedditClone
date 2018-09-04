// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const should = chai.should();

// chai.use(chaiHttp);

// const database = require('../database');

// const Post = require('../models/post');

// describe('Posts', () => {
//     it('should create with valid attributes at POST /post', (done) => {
//         database.getAll(Post).then((posts) => {
//             var postCount = posts.count;
          
//             var post = new Post({ title: "post title", url: "https://www.google.com", summary: "post summary" });
//             chai.request('localhost:4200')
//               .post('/posts/new')
//               .set('content-type', 'application/x-www-form-urlencoded')
//               .send(post)
//               .end((err, res) => {

//                 if (err) {
//                     console.error(err);
//                     done();
//                 }

//                 database.getAll(Post).then((posts) => {
//                     var newCount = posts.count;
//                     newCount.should.be.equal(postCount + 1);
                    
//                     res.should.have.status(200);
//                     done();
//                 }).catch((error) => {
//                     console.error(error);
//                     done();
//                 });
//             });
//           }).catch((error) => {
//               console.error(error);
//               done();
//           });
//     });
// });