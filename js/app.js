import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Your Supabase project details
const supabaseUrl = 'https://axdfzquekxjwlcerwgzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZGZ6cXVla3hqd2xjZXJ3Z3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NDM3NDQsImV4cCI6MjAxNDQxOTc0NH0.Q8OKjG2EeFeVkNFDTIwINem4QyHpp2uuXKkGRQM-62I';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

let modalTitle;
let modalText; 

// Get the navigation items
const navItems = document.querySelectorAll('.navbar-nav-item');

// Add click event listeners to all navigation items except the already active one
navItems.forEach((item) => {
    item.addEventListener('click', function () {
        // Remove the "active" class from all navigation items
        navItems.forEach((navItem) => {
            navItem.classList.remove('active');
        });

        // Add the "active" class to the clicked navigation item
        this.classList.add('active');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Add a click event listener to the entire <ul> to handle clicks on anchor tags
    const navbarNav = document.querySelector('.navbar-nav');
    navbarNav.addEventListener('click', function (event) {
        if (event.target.classList.contains('test-link')) {
            // If a link with the 'test-link' class is clicked, extract the data attributes
            const start = parseInt(event.target.getAttribute('data-start'), 10);
            const end = parseInt(event.target.getAttribute('data-end'), 10);
            generateTestButtons(start, end);
        }
    });
});


function generateTestButtons(start, end) {
    const testNumberContainer = document.querySelector('.test-number-container');
    testNumberContainer.innerHTML = ''; // Clear existing test buttons

    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'testBtn';
        button.textContent = 'Test ' + i;
        button.dataset.testNumber = i;
        button.addEventListener('click', handleTestButtonClick); // Add click event listener
        testNumberContainer.appendChild(button);
    }

    const sectionTitle = document.querySelector('.section-title');
    sectionTitle.textContent = 'Test (' + start + '-' + end + ')';
    document.querySelector(".test-container").style.display = "block";
}



let alertShown = false;
//--------------------//
//Enable read access for all users
async function fetchCountries(col) {
    showLoadingAnimation();
    try {
      const { data, error } = await supabase
        .from(col)
        .select();
  
      if (error) {
        throw new Error('Error fetching data: ' + error.message);
      }
  
      return data;
    } catch (error) {
      console.error('An error occurred:', error.message);
      return null; // You can return null or handle the error as needed
    }
  }

//--------------------//
function handleTestButtonClick(event) {
    if (alertShown) {
        alert('An set of questions is already shown. Complete the previous action before clicking another button.');
        return;
    }
    alertShown = true;

    const testNumber = event.currentTarget.dataset.testNumber;

    let section_title = document.querySelector('.getTitle');
    section_title.setAttribute('data-test-number', testNumber);
    section_title.innerHTML = `<h1>Questions for TEST ${testNumber}</h1>`;
    document.getElementById('hide').style.display = "block";

    // Construct the array name based on the serial number
    const arrayName = `Test_${testNumber}`;

fetchCountries(arrayName) 
  .then((questionData) => {
    if(questionData){
        const testArray = questionData;
    const numColumns = 3; // Number of columns

    // Calculate the number of questions per column
    const questionsPerColumn = Math.ceil(testArray.length / numColumns);

    // Get the question-container element
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = "";

    const analogy_contents = document.createElement("div");
    analogy_contents.className = "analogy-contents";

    // Initialize a variable to store the HTML for each column
    let columnHTML = '';

    // Iterate through the testArray and generate HTML for each question
    for (let i = 0; i < testArray.length; i++) {
      const analogy = testArray[i];
      const questionNumber = i + 1;

      // Create the analogy div
      const analogyDiv = document.createElement('div');
      analogyDiv.className = 'analogy';
      analogyDiv.setAttribute('data-question-number', questionNumber);

      // Create the h2 element for the question
      const questionH2 = document.createElement('h2');
      questionH2.textContent = `${questionNumber}. ${analogy.question}`;

      // Create the options div
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';

      // Array of option labels
      const optionLabels = [analogy.option1, analogy.option2, analogy.option3, analogy.option4, analogy.option5];

      // Iterate through options and create input and label elements
      for (let j = 0; j < optionLabels.length; j++) {
        const optionLetter = String.fromCharCode(97 + j); // Convert 0-4 to 'a'-'e'

        // Create input element
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `analogy${questionNumber}`;
        input.id = `option${optionLetter}${questionNumber}`;
        input.value = optionLetter;

        // Create label element
        const label = document.createElement('label');
        label.htmlFor = `option${optionLetter}${questionNumber}`;
        label.textContent = optionLabels[j];

        // Check if this is the correct option and add the data-correct attribute
        if (optionLetter === analogy.correctOption) {
          input.setAttribute('data-correct', 'true');
        }

        // Append input and label to the options div
        optionsDiv.appendChild(input);
        optionsDiv.appendChild(label);
        optionsDiv.appendChild(document.createElement('br'));
      }

      // Append questionH2 and optionsDiv to the analogy div
      analogyDiv.appendChild(questionH2);
      analogyDiv.appendChild(optionsDiv);

    //   const explanationDiv = document.createElement("div");
    //   explanationDiv.id = "explanations";
    //   analogyDiv.appendChild(explanationDiv);

      // Append the analogy div to the columnHTML
      columnHTML += analogyDiv.outerHTML;

      // If we've reached the questionsPerColumn or it's the last question, inject the column into the question-container
      if ((i % questionsPerColumn === questionsPerColumn - 1) || i === testArray.length - 1) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        columnDiv.innerHTML = columnHTML;
        analogy_contents.appendChild(columnDiv);
        columnHTML = ''; // Reset for the next column
      }
      questionContainer.append(analogy_contents);
      document.querySelector(".submintBtn-container").style.display = "flex";
      hideLoadingAnimation();
    }
    }else{
        console.error(`Question array not found for Test ${testNumber}`);
        modalTitle = "Error !!";
        modalText = `
        <h2>You were trying for Test ${testNumber}</h2>
        <h3>You are facing this message because:</h3>
        <ul>
            <li>Questions for Test ${testNumber} have not been uploaded yet, or</li>
            <li>Your internet connection is unstable, or</li>
            <li>You have not completed all the required fields, or</li>
            <li>The server is currently experiencing high traffic.</li>
        </ul>
        `;
        generateInstructionDiv();
        hideLoadingAnimation();
        setModalText(modalTitle, modalText);
        alertShown = false;
    }

  })
  .catch(error => console.error('Error loading JSON:', error));

}// end of handleTestButtonClick//

function getQuestionData() {
    let section_title = document.querySelector('.getTitle');
    let testNumber = section_title.getAttribute('data-test-number');
    const testName = `Test_${testNumber}`;

    const analogyDivs = document.querySelectorAll('.analogy'); // Select all analogy divs

    return fetchCountries(testName) 
    .then((questionContent) => {
            const testQuestions = questionContent;

            // Loop through each analogy div
            analogyDivs.forEach(analogyDiv => {
                const explanationDiv = analogyDiv.querySelector('.explanation'); // Check if an explanation div already exists

                if (!explanationDiv) {
                    const questionH2 = analogyDiv.querySelector('h2');
                    let question = questionH2.textContent.trim(); // Get the question text
                    question = question.replace(/^\d+\.\s/, '').trim(); // Remove numeric prefix

                    // Find the corresponding object in testQuestions based on the question text
                    const questionData = testQuestions.find(q => q.question.trim() === question);

                    if (questionData) {
                        if (questionData.explanation) {
                            // Create an explanation div
                            const newExplanationDiv = document.createElement('div');
                            newExplanationDiv.className = 'explanation';
                            newExplanationDiv.innerHTML = `<p><strong>Explanation:</strong> <span>${questionData.explanation}</span></p>`;

                            // Append the explanation div to the analogy div
                            analogyDiv.appendChild(newExplanationDiv);
                        } else {
                            // Create an explanation div
                            const newExplanationDiv = document.createElement('div');
                            newExplanationDiv.className = 'explanation';
                            newExplanationDiv.innerHTML = `<p><strong>No Explanation Found !!</strong> </p>`;

                            // Append the explanation div to the analogy div
                            analogyDiv.appendChild(newExplanationDiv);
                        }
                    }
                }
            });
            hideLoadingAnimation();
        })
        .catch(error => {
            hideLoadingAnimation();
            console.error('Error loading JSON:', error);
            return null; // Handle the error as needed
        });
}



// calculate results//
function calculateResult() {
    const analogyDivs = document.querySelectorAll('.analogy');
    const totalQuestions = analogyDivs.length;
    // Get all radio inputs
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    // Disable each radio input
    radioInputs.forEach(input => {
        input.disabled = true;
    });

    let answeredQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    alertShown = false;

    analogyDivs.forEach(analogyDiv => {
        const explanationDiv = document.createElement("div");
        explanationDiv.id = "explanations";
        explanationDiv.innerText = ``;
        analogyDiv.appendChild(explanationDiv);


        const questionNumber = analogyDiv.dataset.questionNumber;
        const selectedOption = document.querySelector(`input[name="analogy${questionNumber}"]:checked`);

        const correctInputLabels = document.querySelectorAll('input[data-correct="true"]');

        correctInputLabels.forEach(input => {
        const labelForInput = document.querySelector(`label[for="${input.id}"]`);
        if (labelForInput) {
            labelForInput.style.backgroundColor = '#05b62b'; // Set the background color to green
        }
        });

          
        if (selectedOption) {
            answeredQuestions++;
            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            const labelForOption = document.querySelector(`label[for="${selectedOption.id}"]`);
            if (isCorrect) {
                correctAnswers++;
                // Add a class to the correct answer input, pseudo element, and label
                selectedOption.classList.add('correct-answer');
                
                if (labelForOption) {
                    labelForOption.classList.add('correct-answer');
                    labelForOption.style.background = '#05b62b';
                }
            }else{
                wrongAnswers++;
                labelForOption.classList.add('wrong-answer');
            }
        }
    });

    let section_title = document.querySelector('.getTitle');
    let testNumber = section_title.getAttribute('data-test-number');

    // Calculate the result and display it (you can customize the display)
    const resultPercentage = (correctAnswers / totalQuestions) * 100;
    const resultMessage = `You answered ${correctAnswers} out of ${totalQuestions} correctly (${resultPercentage.toFixed(2)}%)`;
    // alert(resultMessage);
    modalTitle = `Your Result for test ${testNumber} !!`;
    modalText = `
    <h2 class="underline"><strong>Result Summary:</strong></h2>
    <ul class="resultSummary">
        <li><strong>You have secure:</strong> <span>${resultPercentage.toFixed(2)}%</span></li>
        <li><strong>Total Obtained Marks:</strong><span class="obtainMark">${correctAnswers} out of ${totalQuestions}</span></li>
        <li><strong>Total Questions:</strong> <span>${totalQuestions}</span></li>
        <li><strong>You answered:</strong><span>${answeredQuestions}</span></li>
        <li><strong>Total Wrong Answers:</strong><span>${wrongAnswers}</span></li>
        <li><strong>Total Correct Answer:</strong><span>${correctAnswers}</span></li>
    </ul>
    `;
    setModalText(modalTitle, modalText);
    getQuestionData();
}

// Add a click event listener to the "Generate Results" button
const generateResultsButton = document.getElementById('generateResults');
generateResultsButton.addEventListener('click', calculateResult);




// Get the element with the class "navbar-title"
const navbarTitle = document.querySelector('.navbar-title');

// Add a click event listener to the "navbar-title" element
navbarTitle.addEventListener('click', () => {
    if(!alertShown){
        // Reload the page
    location.reload();
    }
});


document.addEventListener("DOMContentLoaded", generateInstructionDiv);
// Create the instruction div
function generateInstructionDiv() {

    const instructionDiv = document.createElement('div');
    instructionDiv.classList.add('Instructions');

    // Create the content for the instruction div
    instructionDiv.innerHTML = `
    <div class="ins-content">
        <h1>Welcome to the Analogy Test Page</h1>
        <div>
            <p>This web page allows you to practice analogy questions. Here's how to use it:</p>
        
            <h2>Instructions:</h2>
            <ol>
                <li>On the left, you'll find a navigation bar with different test ranges. Click on a test range to get started.</li>
        
                <li>Once you select a test range, a set of analogy questions will appear on the right side. Each question has five answer options.</li>
        
                <li>Choose your answer by clicking one of the radio buttons next to the answer options.</li>
        
                <li>If you're unsure about an answer, you can skip to the next question. You can revisit skipped questions later.</li>
        
                <li>Continue answering the questions until you've completed the test.</li>
        
                <li>After completing the test, click the "Generate Results" button to see your score.</li>
        
                <li>Your results will be displayed, including the number of correct answers and the percentage of correct responses.</li>
            </ol>
        
            <h2>Scoring:</h2>
            <p>Each correct answer earns you a point. Your score is calculated based on the number of correct answers.</p>
        
            <h2>Reviewing Questions:</h2>
            <p>After completing the test, you can review your answers. Correct answers will be highlighted in green.</p>
        
            <h2>Feedback:</h2>
            <p>If you have any feedback or questions, feel free to reach out to us through the provided contact information.</p>
        
            <h2>Enjoy your practice and good luck!</h2>
        </div>
    </div>
    `;

    // Append the instruction div to the answer-table-container div
    const answerTableContainer = document.getElementById('question-container');
    answerTableContainer.innerHTML = '';
    answerTableContainer.appendChild(instructionDiv);

    document.querySelector(".submintBtn-container").style.display = "none";
}








var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var closeBtn = document.getElementById("closeModal");
var closeBtn2 = document.getElementById("closeModalBtn");


// Function to set the text in the modal body
function setModalText(title, text) {
    let modalTitle = document.querySelector(".modal-header h2");
    let modalBody = document.querySelector(".modal-body");

    modalTitle.innerHTML = "";
    modalBody.innerHTML = "";

    modalTitle.innerHTML = title;
    modalBody.innerHTML = text;
    showModal();
}

function showModal() {
    modal.style.display = "block";
    setTimeout(function() {
        modal.querySelector('.modal-content').style.transform = "scale(1)";
    }, 50);
}

closeBtn.onclick = function() {
    modal.querySelector('.modal-content').style.transform = "scale(0)";
    setTimeout(function() {
        modal.style.display = "none";
    }, 300);
}

closeBtn2.onclick = function() {
    modal.querySelector('.modal-content').style.transform = "scale(0)";
        setTimeout(function() {
            modal.style.display = "none";
        }, 300);
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.querySelector('.modal-content').style.transform = "scale(0)";
        setTimeout(function() {
            modal.style.display = "none";
        }, 300);
    }
}

//-----------------------------------------------//
// Add event listener to the img tag
document.querySelector('.navbar-title img').addEventListener('click', function () {
    window.location.href = 'index.html'; // Redirect to index.html
});

// Add event listener to the h1 tag
document.querySelector('.navbar-title h1').addEventListener('click', function () {
    window.location.href = 'index.html'; // Redirect to index.html
});

// Add event listener to the parent-company paragraph
document.getElementById('parent-company').addEventListener('click', function () {
    window.location.href = 'https://BcsBankSuccess.com'; // Redirect to BcsBankSuccess.com
});
//-------------------------------------------------//
function showLoadingAnimation() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.style.display = 'flex'; // Display the loader container
    }
}

function hideLoadingAnimation() {
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        loaderContainer.style.display = 'none'; // Hide the loader container
    }
}
//------------------------------------------------------//
function addPagesToModal() {
    fetchCountries('app_list')
        .then((appDetails) => {
            if (appDetails) {
                // Create a table with three columns: App Name, Link, and Description
                const tableContent = `
                    <table>
                        <tr>
                            <th>App Name</th>
                            <th>Description</th>
                        </tr>
                        ${appDetails.map(app => `
                            <tr>
                                <td><a href="${app.app_link}" target="_blank">${app.app_name}</a></td>
                                <td>${app.app_desc}</td>
                            </tr>
                        `).join('')}
                    </table>
                `;

                // Set the modal title and text
                const modalTitle = "Explore Other Apps";
                const modalText = `
                    <p>Click on the App Name below to explore other apps:</p>
                    ${tableContent}
                `;
                hideLoadingAnimation();
                // Call the setModalText function with the title and text
                setModalText(modalTitle, modalText);
            }
        })
        .catch(error => console.error('Error:', error));
}

document.querySelector('.explore-apps a').addEventListener('click', addPagesToModal);
//-----------------------------------------------------//
const currentDate = new Date(); 
const currentYear = currentDate.getFullYear(); 
document.getElementById('currentYear').innerHTML = currentYear;