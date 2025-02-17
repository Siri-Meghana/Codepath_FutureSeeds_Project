// Add JavaScript code for your web site here and call it from index.html.
// Variable to control the scaling factor
let scaleFactor = 1;

// Select the image within the modal
const modalImage = document.querySelector('#thanks-modal img');

// Variable to hold the interval ID for scaling animation
let intervalId;

// Select the Close Modal button
const closeModalButton = document.getElementById('close-modal-button');

// Function to scale the image
const scaleImage = () => {
    // Toggle the scaleFactor between 1 and 0.8
    scaleFactor = scaleFactor === 1 ? 0.8 : 1;

    // Apply the scaling to the image
    modalImage.style.transform = `scale(${scaleFactor})`;
};

// Function to hide the modal
const hideModal = () => {
    const modal = document.getElementById('thanks-modal');

    // Hide the modal
    modal.style.display = 'none';

    // Clear the interval to stop the animation if it's still running
    clearInterval(intervalId);

    // Reset the image scale to default
    modalImage.style.transform = 'scale(1)';
};


// Query the theme button using getElementById
let themeButton = document.getElementById("theme-button");

// Define the toggleDarkMode function to toggle the dark-mode class on the body
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
};

// Add an event listener to the theme button to trigger toggleDarkMode on click
themeButton.addEventListener("click", toggleDarkMode);

// Query for the "Sign Now" button
let signNowButton = document.getElementById("sign-now-button");

// Initial count of signatures
let count = 3;

// Function to add a new signature
const addSignature = (person) => {
    // Create a new paragraph element for the signature
    const newSignature = document.createElement("p");
    newSignature.textContent = `🖊️ ${person.name} from ${person.hometown} supports this.`;

    // Append the new signature to the signatures section
    const signaturesSection = document.querySelector(".signatures");
    signaturesSection.appendChild(newSignature);

    // Update the counter
    const counter = document.getElementById("counter");
    counter.remove();

    count += 1;

    const newCounter = document.createElement("p");
    newCounter.id = "counter";
    newCounter.textContent = `🖊️ ${count} people have signed this petition and support this cause.`;

    signaturesSection.appendChild(newCounter);
};

// Function to display and hide the modal
const toggleModal = (person) => {
    const modal = document.getElementById('thanks-modal');
    const modalContent = document.getElementById('thanks-modal-content');

    // Show the modal
    modal.style.display = 'flex';

    // Update the modal content
    modalContent.textContent = `Thank you so much, ${person.name}!`;

    // Start the scaling animation
    intervalId = setInterval(scaleImage, 500); // Removed 'const' keyword

    // Hide the modal after a few seconds and stop the animation
    setTimeout(() => {
        hideModal(); // Call the hideModal function
    }, 4000); // Adjust the delay as needed
};

// Add event listener to the Close Modal button
closeModalButton.addEventListener('click', hideModal);

const validateForm = () => {
    let containsErrors = false; // Reset error flag at the start of each validation
    const petitionInputs = document.getElementById("sign-petition").elements; // Get all form inputs
    const email = document.getElementById('email'); // Get the email input specifically

    // First loop to validate each input (checking for minimum length of 2)
    for (let i = 0; i < petitionInputs.length; i++) {
        if (petitionInputs[i].type !== "submit" && petitionInputs[i].value.trim().length < 2) {
            containsErrors = true;
            petitionInputs[i].classList.add('error');
        } else {
            petitionInputs[i].classList.remove('error');
        }
    }

    // Additional validation for email to check for '.com'
    if (email && email.value && !email.value.includes('.com')) {
        containsErrors = true;
        email.classList.add('error');
    } else if (email) {
        email.classList.remove('error');
    }

    // Check if there are no errors
    if (!containsErrors) {
        // Create the person object
        const person = {
            name: document.getElementById("name").value,
            hometown: document.getElementById("hometown").value,
            email: document.getElementById("email").value
        };

        // Call addSignature(person) to add the new signature
        addSignature(person);

        // Call toggleModal(person) to display the modal
        toggleModal(person);

        // Clear all input fields in the form
        for (let i = 0; i < petitionInputs.length; i++) {
            if (petitionInputs[i].type !== "submit") {
                petitionInputs[i].value = "";
            }
        }
    }
};

// Add event listener for validation
signNowButton.addEventListener('click', validateForm);

// Define the animation properties
let animation = {
    revealDistance: 150,
    initialOpacity: 0,
    transitionDelay: 0,
    transitionDuration: '2s',
    transitionProperty: 'all',
    transitionTimingFunction: 'ease'
};

// Select all elements with the revealable class
let revealableContainers = document.querySelectorAll('.revealable');

// Define the reveal function
const reveal = () => {
    revealableContainers.forEach((element) => {
        const windowHeight = window.innerHeight;
        const topOfRevealableContainer = element.getBoundingClientRect().top;

        if (topOfRevealableContainer < windowHeight - animation.revealDistance) {
            // Add the active class when within reveal distance
            element.classList.add('active');
            element.style.opacity = 1;
            element.style.transform = 'translateY(0px)';
        } else if (!isMotionReduced) {
            // Reset animation state only if reduced motion is OFF
            element.classList.remove('active');
            element.style.opacity = 0;
            element.style.transform = `translateY(${animation.revealDistance}px)`;
        }
    });
};


// Attach the reveal function to the window scroll event
window.addEventListener('scroll', reveal);

// Variable to track the current state of reduced motion
let isMotionReduced = false;

const toggleReduceMotion = () => {
    isMotionReduced = !isMotionReduced; // Toggle the state

    const reduceMotionButton = document.getElementById("reduce-motion-button");

    if (isMotionReduced) {
        // Apply reduced motion styles
        animation.revealDistance = 0;
        animation.initialOpacity = 1;
        animation.transitionDuration = '0s'; // Disable animation duration
        animation.transitionTimingFunction = 'none'; // No easing function

        // Update button text and style
        reduceMotionButton.textContent = "Motion: OFF";
        reduceMotionButton.style.backgroundColor = "#e0e0e0"; // Light gray background
        reduceMotionButton.style.color = "#000"; // Dark text color

        // Apply reduced motion immediately to revealable elements
        revealableContainers.forEach((element) => {
            element.style.transitionProperty = 'none'; // Disable transitions
            element.style.transitionDuration = '0s';
            element.style.opacity = 1; // Fully visible
            element.style.transform = 'translateY(0px)'; // Reset position
        });
    } else {
        // Restore normal motion styles
        animation.revealDistance = 150;
        animation.initialOpacity = 0;
        animation.transitionDuration = '2s'; // Restore animation duration
        animation.transitionTimingFunction = 'ease'; // Restore easing

        // Update button text and style
        reduceMotionButton.textContent = "Motion: ON";
        reduceMotionButton.style.backgroundColor = "#512260"; // Original background
        reduceMotionButton.style.color = "#fff"; // White text color

        // Reset revealable elements to animation-ready state
        revealableContainers.forEach((element) => {
            element.style.transitionProperty = animation.transitionProperty;
            element.style.transitionDuration = animation.transitionDuration;
            element.style.transitionTimingFunction = animation.transitionTimingFunction;
            element.style.transitionDelay = `${animation.transitionDelay}s`;
            element.style.opacity = animation.initialOpacity; // Hide again for animation
            element.style.transform = `translateY(${animation.revealDistance}px)`; // Reset position
        });

        // Trigger animation again as user scrolls
        reveal();
    }
};


// Attach the event listener to the Reduce Motion button
document.getElementById("reduce-motion-button").addEventListener("click", toggleReduceMotion);


