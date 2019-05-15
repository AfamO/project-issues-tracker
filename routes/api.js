/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const DBApp= require('./DBApp');

const CONNECTION_STRING = process.env.DB;


module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res){
      var projectname = req.params.project;
      if(req.query._id!=null)
      {
        var issueId=req.query._id;
        DBApp.queryIssueById(issueId,function(err,data){
        if(err)
        {
          res.json({msg:"could not find issue with id: "+issueId});
        }
        else {
          res.json(data);
        }
      });
      }
      else {
        if(projectname===null)
          res.json({msg:"no project name supplied. Required atleast the project name"});
        var issue_title = req.query.issue_title;
        var issue_text =  req.query.issue_text;
        var created_by =  req.query.created_by;
        var assigned_to = req.query.assigned_to;
        var status_text = req.query.status_text;
        var created_on =  req.query.created_on;
        var updated_on =  req.query.updated_on;
        var assigned_to =  req.query.assigned_to;
        var open = req.query.open;
        DBApp.queryIssue(projectname,issue_title,issue_text,created_by,assigned_to,status_text,created_on,updated_on,open,function(err,data){
          if(err)
            res.json({msg:"Failed to retrieve all issues for project "+projectname});
          res.json(data);
        });
      }

    })

    .post(function (req, res){
      var project = req.params.project;
      var issueBody= req.body;
      issueBody.projectname=project;
      if(issueBody==null)
      {
        res.json({msg:"Missing Body: The api needs parameters in its form body"});
      }
      else if(issueBody.issue_title==null || issueBody.issue_text==null || issueBody.created_by==null)
      {
        res.json({msg:"Missing required fields"});
      }
      else {
        DBApp.createNewIssue(issueBody,function(err,data){
          if(err)
            res.json({msg:"Failed to create issue with title "+req.body.issue_title});
          res.json(data);
        });
      }

    })

    .put(function (req, res){
      var project = req.params.project;
      var issueId=req.body._id;
      var issueBody= req.body;
      if(Object.keys(req.body).length==0)
        res.json({msg:"no updated field sent"});
      else{
        DBApp.queryIssueById(issueId,function(err,data){
          if(err)
            res.json({msg:"could not find issue with id: "+issueId})
          issueBody.updated_on=new Date().toString();
          DBApp.updateIssue(data,issueBody,function(err,data){
            if(err)
              res.json({msg:"could not update "+issueId,status:500});
            res.json({msg:"successfully updated "+issueId,status:200});
          });
        });

      }

    })

    .delete(function (req, res){
      var project = req.params.project;
      if(req.query._id==null && req.body._id==null)
          res.json({msg:"_id error:No id sent"});

      else{
        var issueId=(req.query._id==null) ? req.body._id: req.query._id
        DBApp.queryIssueById(issueId,function(err,data){
        if(err)
        {
          console.log("could not find issue with id: "+issueId);
          res.json({msg:"could not find issue with id: "+issueId});
        }
        else {
          DBApp.deleteIssueById(issueId,function(err,data){
          if(err)
              res.json({msg:"could not delete "+issueId,status:500});
          res.json({msg:"deleted "+issueId,status:200});
          });
        }
      });
      }

    })

};
