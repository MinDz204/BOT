const inputString = ':Primogem~3: ×100 + :Mora~2: ×50.000 (8BQ9CMMVS5PM)';

// Define a regular expression pattern to match the content inside parentheses
const regex = /\(([^)]+)\)/;

// Use the exec() method to find the first match
const match = regex.exec(inputString);

// Check if there is a match
if (match && match[1]) {
    const contentInsideParentheses = match[1];
    console.log(contentInsideParentheses);
} else {
    console.log('No match found.');
}