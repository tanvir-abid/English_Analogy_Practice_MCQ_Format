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
        button.addEventListener('click', generateTableOnButtonClick); // Add click event listener
        testNumberContainer.appendChild(button);
    }

    const sectionTitle = document.querySelector('.section-title');
    sectionTitle.textContent = 'Test (' + start + '-' + end + ')';
    document.querySelector(".test-container").style.display = "block";
}

//------------------------------------//


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

// Call the function to fetch the 'countries' table
function generateTableOnButtonClick(){
    const testNumber = event.currentTarget.dataset.testNumber;
    
    let section_title = document.querySelector('.new-title h1');
    section_title.setAttribute('data-test-number', testNumber);
    section_title.innerHTML = `Questions for TEST ${testNumber}`;

    // Construct the array name based on the serial number
    const arrayName = `Test_${testNumber}`;

    fetchCountries(arrayName)
    .then((questionContents) => {
      if (questionContents) {
        
        // You can process or display the data here
        document.getElementById('hide').style.display = "flex";
        createTableFromQuestionArray(questionContents);
        hideLoadingAnimation(); 
      }else{
            console.log("data not found");
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
            document.getElementById('hide').style.display = "none";
            setModalText(modalTitle, modalText);
       }
    });
}

//--------------------------------------//


function createTableFromQuestionArray(questionArray) {
    const tableContainer = document.querySelector('.answer-table-container');
    tableContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.id = 'answerTable';

    const tableHeader = table.createTHead();
    const headerRow = tableHeader.insertRow(0);
    headerRow.innerHTML = '<th>Serial</th><th>Question</th><th>Options</th><th>Explanation</th>';

    const tableBody = table.createTBody();

    questionArray.forEach((questionData, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `<td>${index + 1}</td><td>${questionData.question}</td><td>${createOptionsList(questionData)}</td><td>${questionData.explanation}</td>`;
    });

    tableContainer.appendChild(table);
}


function createOptionsList(questionData) {
    const ol = document.createElement('ol');
    const correctAnswers = ['a', 'b', 'c', 'd', 'e'];

    for (let i = 0; i < correctAnswers.length; i++) {
        const li = document.createElement('li');
        li.textContent = questionData['option' + (i + 1)];

        // Check if this is a correct answer and style it differently
        if (correctAnswers[i] === questionData.correctOption) {
            //li.style.fontWeight = 'bold';
            li.classList.add("bold");
        }

        ol.appendChild(li);
    }

    return ol.outerHTML;
}


//---------------------------------------------------------------//
//-------------------//
//---------------------------------------------------------------//


//----------------------------------------------//
//-----------------------//
//-----------------------------------------------//
// Attach the printPDF function to the "Print" button
const printButton = document.getElementById('printButton');
printButton.addEventListener('click', callTwoFunctions);


function callTwoFunctions(){
    generateApplySetting();
    document.querySelector(".modal-header h2").textContent = "Print Settings";
    showModal();
}



var modal = document.getElementById("myModal");
var btn = document.getElementById("openModal");
var closeBtn = document.getElementById("closeModal");
var closeBtn2 = document.getElementById("closeModalBtn");


// Function to set the text in the modal body
function setModalText(title, text) {
    let modalTitle = document.querySelector(".modal-header h2");
    let modalBody = document.querySelector(".modal-body");
    let modalFooter = document.querySelector(".modal-footer");

    modalTitle.innerHTML = "";
    modalBody.innerHTML = "";

    modalTitle.innerHTML = title;
    modalBody.innerHTML = text;

    // Remove all buttons from the modal footer except the one with ID "closeModalBtn"
    let buttons = modalFooter.querySelectorAll("button");
    buttons.forEach(button => {
        if (button.id !== "closeModalBtn") {
            modalFooter.removeChild(button);
        }
    });

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

//-------------------------//



function generateApplySetting(){
    // Create the Print Settings div
const printSettingsDiv = document.createElement('div');
printSettingsDiv.id = 'printSettings';
printSettingsDiv.innerHTML = `

    <form>
        <label for="margin">Margin (mm):</label>
        <select id="margin" name="margin">
            <option value="0.3">0.3mm</option>
            <option value="0.5">0.5mm</option>
            <option value="1">1mm</option>
            <option value="3">3mm</option>
            <option value="5">5mm</option>
            <option value="10">10mm</option>
        </select>
        <br>

        <label for="paperSize">Paper Size:</label>
        <select id="paperSize" name="paperSize">
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
        </select>
        <br>

        <div class="orientation">
            <label for="orientation">Page Orientation:</label>
            <input type="radio" id="portrait" name="orientation" value="portrait" checked>
            <label for="portrait">Portrait</label>
            <input type="radio" id="landscape" name="orientation" value="landscape">
            <label for="landscape">Landscape</label>
        </div>
        <br>
    </form>
`;

// Create the Apply Settings button
const applySettingsButton = document.createElement('button');
applySettingsButton.type = 'button';
applySettingsButton.textContent = 'Apply Settings';
applySettingsButton.onclick = printTable;

// Append the Print Settings div to the modal body
const modalBody = document.querySelector('.modal-body');
modalBody.innerHTML="";
modalBody.appendChild(printSettingsDiv);

// Get all buttons in the footer
const modalFooter = document.querySelector('.modal-footer');
const footerButtons = modalFooter.querySelectorAll('button');

// Check if there are less than two buttons in the footer, then append the Apply Settings button
if (footerButtons.length < 2) {
    modalFooter.appendChild(applySettingsButton);
}

}



function printTable() {
    const margin = document.getElementById('margin').value + 'mm';
    const paperSize = document.getElementById('paperSize').value;
    const orientation = document.querySelector('input[name="orientation"]:checked').value;

    // Display the selected settings in the console
    console.log('Margin: ' + margin);
    console.log('Paper Size: ' + paperSize);
    console.log('Orientation: ' + orientation);

    const companyName = "BcsBankSuccess.com";
    const title = document.querySelector('.new-title h1').textContent;

    const table = document.getElementById('answerTable'); // Get the HTML table element

    const printWindow = window.open('', '_blank'); // Open a new tab
    printWindow.document.write(`<html><head><title>${title} | BcsBankSuccess</title>`);

    // Include an external stylesheet
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="css/print.css">');
    printWindow.document.write('<style>@page { size: ' + paperSize + ' ' + orientation + '; margin: ' + margin + '; }</style>');
    printWindow.document.write('</head><body>');

    // Print the watermark multiple times throughout the entire page
    for (let i = 0; i < 10; i++) { // Adjust the number of times you want the watermark to appear
        printWindow.document.write('<div class="watermark">' + companyName + '</div>');
    }

    // Print Company Name and Title
    printWindow.document.write('<div class="centered"><h1>' + companyName + '</h1></div>');
    printWindow.document.write('<div class="centered"><h2>' + title + '</h2></div>');

    // Print the table
    printWindow.document.write(table.outerHTML);

    // Get the footer element and append it to the printed page
    const footer = document.querySelector('footer');
    if (footer) {
        printWindow.document.write(footer.outerHTML);
    }
    printWindow.document.write('</body></html>');

    // Close the document and trigger the print dialog
    printWindow.document.close();
    printWindow.print();
}


document.addEventListener("DOMContentLoaded", generateInstructionDiv);
// Create the instruction div
function generateInstructionDiv() {

    const instructionDiv = document.createElement('div');
    instructionDiv.classList.add('Instructions');

    // Create the content for the instruction div
    instructionDiv.innerHTML = `
        <div class="ins-content">
            <h1>How to Use the Test Questions Page</h1>

            <div>
                <h3>Step 1: Select a Test</h3>
                <p>1. From the navigation menu, click on "Tests."</p>
                <p>2. Choose the desired test by clicking on its name or number.</p>

                <h3>Step 2: Generate Test Questions Table</h3>
                <p>1. Click on the "Generate Questions" button for the selected test.</p>
                <p>2. A table will be generated containing test questions, options, answers, and explanations.</p>

                <h3>Step 3: Customize the PDF (Optional)</h3>
                <p>1. To customize the PDF before printing or saving, use the "Print Settings" panel.</p>
                <p>2. You can adjust the paper size, margin, and page orientation.</p>
                <p>3. Click "Apply Settings" to apply the selected customization.</p>

                <h3>Step 4: Print or Save the Test Answers</h3>
                <p>1. Click the "Print" button to open a print dialog for the generated table.</p>
                <p>2. You can either print the table directly or save it as a PDF file.</p>

                <p>Note: If you encounter any issues or have questions, please refer to the help section or contact our support team.</p>
            </div>
        </div>
    `;

    // Append the instruction div to the answer-table-container div
    const answerTableContainer = document.querySelector('.answer-table-container');
    answerTableContainer.innerHTML = '';
    answerTableContainer.appendChild(instructionDiv);
}
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
//----------------------------------------------------//
const currentDate = new Date(); 
const currentYear = currentDate.getFullYear(); 
document.getElementById('currentYear').innerHTML = currentYear;
