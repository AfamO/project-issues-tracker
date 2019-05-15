const mongoose=require('mongoose');
const CONNECTION_STRING = process.env.DB;
console.log("Mongo Uri=="+CONNECTION_STRING);
mongoose.connect(CONNECTION_STRING,{useNewUrlParser:true});
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', function() {
    console.log("We're connected to DB!");
});

let Schema = mongoose.Schema;

const issueSchema = new Schema({
  projectname:{type:String,default:"React", required:true},
  issue_title:{type:String,default:"Component Failed",required:true},
  issue_text:{type:String,default:"My comp failed",required:true},
  created_by:{type:String,default:"AfamO", required:true},
  assigned_to:{type:String,default:"Ciga"},
  status_text:{type:String,default:"In Dev"},
  created_on:{type:Date,default:Date.now()},
  updated_on:{type:Date,default:Date.now()},
  open:{type:Boolean,default:true, required:true},

});

const Issue = mongoose.model('Issue',issueSchema);

const createNewIssue = (newIssue,done) => {
  let issue = new Issue(newIssue);
  issue.save(function(err,data){
    if(err)
      return done(err);
    done(null,data);
  });
};

const queryIssue= (projectname,issue_title,issue_text,created_by,assigned_to,status_text,created_on,updated_on,open,done)=>{
  let query= Issue.find({projectname:projectname});
  query.sort({issue_title:'asc'});
  query.select('-projectname');
  if(issue_title!=null)
    query.where('issue_title').equals(issue_title);
  if(issue_text!=null)
    query.where('issue_text').equals(issue_text);
  if(created_by!=null)
    query.where('created_by').equals(created_by);
  if(assigned_to!=null)
      query.where('assigned_to').equals(assigned_to);
  if(status_text!=null)
      query.where('status_text').equals(status_text);
  if(created_on!=null)
      query.where('created_on').equals(created_on);
  if(updated_on!=null)
      query.where('updated_on').equals(updated_on);
  if(open!=null)
      query.where('open').equals(open);
  query.exec(function(err,data){
    if(err)
      return done(err);
    //console.log(" Results of queryIssues=="+JSON.stringify(data));
    done(null,data);
  });
};

const queryIssueById =(issueId,done)=>{
    Issue.findOne({_id:issueId},function(err,data){
      if(err)
            done(err);
        done(null,data);
    });
};

const deleteIssueById =(issueId,done)=>{
    Issue.deleteOne({_id:issueId},function(err,data){
      if(err)
            done(err);
        //console.log(" Results of deleteIssueById=="+JSON.stringify(data));
        done(null,data);
    });
};

const updateIssue = function(retriedData,issueObject, done) {
        for(key in issueObject){
          retriedData[key]=issueObject[key];
        }
        retriedData.save(function(err,data){
            if(err)
                done(err);
            done(null,data);

        });
      };

exports.createNewIssue = createNewIssue;
exports.deleteIssueById = deleteIssueById;
exports.queryIssueById = queryIssueById;
exports.queryIssue=queryIssue;
exports.updateIssue=updateIssue;
