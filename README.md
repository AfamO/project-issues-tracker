**FreeCodeCamp/AfamO**- Information Security and Quality Assurance Project
------

## Project Issue Tracker
All tests passed. Both client and server working as expected.

#### Try it out!

If you want to try the converter, open [this link on Glitch](https://afamo-issue-tracker.glitch.me//).

##### User Stories

1) Prevent cross site scripting(XSS attack).
2) I can `POST` /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
3) The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed) and id.
4)  I can `PUT`  /api/issues/{projectname} with a id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update 'id. This should always update updated_on. If no fields are sent return 'no updated field sent'.

5)I can `DELETE` /api/issues/{projectname} with a id to completely delete an issue. If no id is sent return 'id error', success: 'deleted '+ id, failed: 'could not delete '+id.

6) I can `GET` /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
7) I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
8) All 11 functional tests are complete and passing.
