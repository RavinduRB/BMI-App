const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const calculateButton = document.getElementById('calculate');
const resetButton = document.getElementById('reset');
const bmiDisplay = document.getElementById('bmi');
const bmiCategoryDisplay = document.getElementById('bmiCategory');
const bubbles = document.querySelector('.bubbles');
const resultsList = document.querySelector('#results ul');
let myChart; // Declare chart variable


calculateButton.addEventListener('click', calculateBMI);
resetButton.addEventListener('click', reset);

for (let i = 0; i <= 20; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    bubble.style.left = `${x}%`;
    bubble.style.bottom = `${y}%`;
    bubbles.append(bubble);
}


function calculateBMI() {
    const height = parseFloat(heightInput.value) / 100;
    const weight = parseFloat(weightInput.value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        bmiDisplay.textContent = "Invalid Input";
        bmiCategoryDisplay.textContent = "";
        return;
    }

    const bmi = weight / (height * height);
    const bmiData = {
        date: new Date().toLocaleDateString(),
        bmi: bmi.toFixed(2),
        category: getBMICategory(bmi)
    };

    storeBMIData(bmiData);
    displayBMIData();

    bmiDisplay.textContent = bmi.toFixed(2);
    bmiCategoryDisplay.textContent = getBMICategory(bmi);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi < 25) {
        return "Normal weight";
    } else if (bmi < 30) {
        return "Overweight";
    } else {
        return "Obese";
    }
}

function storeBMIData(bmiData) {
    let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    bmiHistory.push(bmiData);
    localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
}

function displayBMIData() {
    const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    resultsList.innerHTML = '';

    const dates = bmiHistory.map(item => item.date);
    const bmis = bmiHistory.map(item => parseFloat(item.bmi));
    const categories = bmiHistory.map(item => getBMICategory(parseFloat(item.bmi)));

    const chartData = {
        labels: dates,
        datasets: [{
            label: 'BMI History',
            data: bmis,
            borderColor: 'rgb(54, 162, 235)', // Blue line
            tension: 0.4,
            fill: false,
        }]
    };

    if (myChart) {
        myChart.data = chartData;
        myChart.update();
    } else {
          const ctx = document.getElementById('myChart').getContext('2d');
          myChart = new Chart(ctx, {
              type: 'line',
              data: chartData,
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      }


    bmiHistory.forEach((data, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${data.date}: BMI ${data.bmi} (${getEmoji(categories[index])})`;
        resultsList.appendChild(listItem);
    });
}


function getEmoji(category){
    switch(category){
        case "Underweight":
        case "Obese":
            return "🙁"; //Not good
        case "Overweight":
            return "😐"; //Good
        case "Normal weight":
            return "😀";  //Very Good
        default:
            return "";
    }
}

function reset() {
    heightInput.value = '';
    weightInput.value = '';
    bmiDisplay.textContent = '';
    bmiCategoryDisplay.textContent = '';
    resultsList.innerHTML = ''; //Clear the history
    if (myChart) {
        myChart.destroy(); //destroy chart
        myChart = null; //set chart to null
    }
}