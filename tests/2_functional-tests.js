/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.projectname, 'test');
          assert.equal(res.body.status_text, 'In QA');

          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Required fields',
            issue_text: 'required fields should work very well',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Required fields');
            assert.equal(res.body.issue_text, 'required fields should work very well');
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
            done();
          });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/mypro')
          .send({
            created_by: 'Functional Test - Missing required fields',
            issue_status: 'Resolved',
            open: true,
            assigned_to:'Guru'
          })
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.msg,"Missing required fields");
            assert.equal(res.body.issue_title, null);
            assert.equal(res.body.issue_text, null);
            done();
          });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/mypro')
          .send({

          })
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.msg,"no updated field sent");
            assert.equal(res.body.issue_title, null);
            assert.equal(res.body.issue_text, null);
            done();
          });
      });

      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/mypro')
          .send({
            _id:"5cd969f962557626a453627f",
            issue_title:'cool updated title',
          })
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.msg,"successfully updated 5cd969f962557626a453627f");
            done();
          });
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id:"5cd955aa5bf16c1b9449813c",
            issue_title:'cool updated title',
            issue_text:'I have now been updated to be resolved cooly',
            created_by: 'Functional Test - Multiple fields to update',
            status_text: 'Resolved',
            open: true,
            assigned_to:'Guru'
          })
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.msg,"successfully updated 5cd955aa5bf16c1b9449813c");
            done();
          });
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({issue_title:'cool updated title'})
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0],'issue_title');
            assert.property(res.body[0],'issue_text');
            assert.property(res.body[0],'created_on');
            assert.property(res.body[0],'updated_on');
            assert.property(res.body[0],'created_by');
            assert.property(res.body[0],'open');
            assert.property(res.body[0],'status_text');
            assert.property(res.body[0],'_id');
            done();
          });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            issue_title:'cool updated title',
            status_text:'Resolved',
            open:true,
            assigned_to:'Guru'
          })
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0],'issue_title');
            assert.property(res.body[0],'issue_text');
            assert.property(res.body[0],'created_on');
            assert.property(res.body[0],'updated_on');
            assert.property(res.body[0],'created_by');
            assert.property(res.body[0],'open');
            assert.property(res.body[0],'status_text');
            assert.property(res.body[0],'_id');
            done();
          });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({})
          .end(function(err,res){
            assert.equal(res.status, 200);
            assert.equal(res.body.msg,'_id error:No id sent');
            done();
          });
      });

      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({_id:'5cd9671a16dc83278c2a9ff7'})
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.msg,'deleted 5cd9671a16dc83278c2a9ff7');
            done();
          });
      });

    });

});
