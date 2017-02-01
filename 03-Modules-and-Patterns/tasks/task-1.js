/* Task Description */
/* 
 * Create a module for a Telerik Academy course
 * The course has a title and presentations
 * Each presentation also has a title
 * There is a homework for each presentation
 * There is a set of students listed for the course
 * Each student has firstname, lastname and an ID
 * IDs must be unique integer numbers which are at least 1
 * Each student can submit a homework for each presentation in the course
 * Create method init
 * Accepts a string - course title
 * Accepts an array of strings - presentation titles
 * Throws if there is an invalid title
 * Titles do not start or end with spaces
 * Titles do not have consecutive spaces
 * Titles have at least one character
 * Throws if there are no presentations
 * Create method addStudent which lists a student for the course
 * Accepts a string in the format 'Firstname Lastname'
 * Throws if any of the names are not valid
 * Names start with an upper case letter
 * All other symbols in the name (if any) are lowercase letters
 * Generates a unique student ID and returns it
 * Create method getAllStudents that returns an array of students in the format:
 * {firstname: 'string', lastname: 'string', id: StudentID}
 * Create method submitHomework
 * Accepts studentID and homeworkID
 * homeworkID 1 is for the first presentation
 * homeworkID 2 is for the second one
 * ...
 * Throws if any of the IDs are invalid
 * Create method pushExamResults
 * Accepts an array of items in the format {StudentID: ..., Score: ...}
 * StudentIDs which are not listed get 0 points
 * Throw if there is an invalid StudentID
 * Throw if same StudentID is given more than once ( he tried to cheat (: )
 * Throw if Score is not a number
 * Create method getTopStudents which returns an array of the top 10 performing students
 * Array must be sorted from best to worst
 * If there are less than 10, return them all
 * The final score that is used to calculate the top performing students is done as follows:
 * 75% of the exam result
 * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
 */

function solve() {
  var Course = (function () {
    let courseTitle = '';
    const coursePresentations = [],
      courseStudents = [];

    function initializeCourse(title, presentations) {
      const regex = /^\s|\s{2,}|\s$/g;
      const len = presentations.length;

      if (!Array.isArray(presentations) || presentations.length === 0) {
        throw 'The course must have at least one presentation';
      }
      if (regex.test(title) || title === '') {
        throw 'Invalid course title';
      }

      for (let pres of presentations) {
        if (regex.test(pres) || pres === '' || pres === null) {
          throw 'Invalid presentation title';
        }
      }

      courseTitle = title;

      for (let i = 0; i < len; i += 1) {
        coursePresentations.push({
          title: presentations[i],
          id: (coursePresentations.length + 1)
        });
      }
      return this;
    }

    function addStudent(name) {
      const rgx = /^[A-Z][a-z]+ [A-Z][a-z]*$/g;
      if (typeof (name) !== 'string') {
        throw 'The name must be a string!';
      }
      if (!rgx.test(name)) {
        throw 'The student must have a name';
      }

      let student = {
        ID: (courseStudents.length + 1),
        name: name,
        submittedHomeworkIDs: []
      };
      courseStudents.push(student);
      `
      `
      return student.ID;
    }

    function getAllStudents() {
      return courseStudents.map((student, names) => {
        names = student.name.split(' ');
        return {
          firstname: names[0],
          lastname: names[1],
          id: student.ID
        };
      });
    }

    function submitHomework(studentID, homeworkID) {
      if (homeworkID > coursePresentations.length) {
        throw 'No presentation to submit to!';
      }
      if (studentID < 1 || homeworkID < 1) {
        throw 'IDs cannot be less than 1';
      }
      if (Number.isNaN(Number(studentID)) || Number.isNaN(Number(homeworkID))) {
        throw 'IDs must be positive numbers';
      }
      if (studentID > courseStudents.length) {
        throw 'No such ID!';
      }
      if (studentID !== (studentID | 0)) {
        throw 'ID must be positive whole number!';
      }
      if (homeworkID !== (homeworkID | 0)) {
        throw 'ID must be positive whole number!';
      }

      let index = courseStudents.findIndex(student => student.ID === studentID);
      courseStudents[index].submittedHomeworkIDs.push(homeworkID);
    }

    function pushExamResults(results) {
      let studentsIds = [],
        index;

      if (!Array.isArray(results)) {
        throw 'Array of results expected';
      }

      for (let i = 0; i < results.length; i += 1) {
        if (Number.isNaN(Number(results[i].StudentID)) || Number.isNaN(Number(results[i].score))) {
          throw 'Not valid';
        }
        if (results[i].StudentID > courseStudents.length || results[i].StudentID < 1) {
          throw 'No such ID!';
        }
        if (studentsIds.indexOf(results[i].StudentID) >= 0) {
          throw 'Student already has score!';
        }

        index = courseStudents.findIndex(s => s.ID === results[i].StudentID);
        if (index < 0) {
          throw 'no such student';
        }

        studentsIds.push(results[i].StudentID);
        courseStudents[index].score = results[i].score;
      }
    }

    return {
      init: initializeCourse,
      addStudent: addStudent,
      getAllStudents: getAllStudents,
      submitHomework: submitHomework,
      pushExamResults: pushExamResults,
      getTopStudents: function () {}
    }
  }());

  return Course;
}

module.exports = solve;