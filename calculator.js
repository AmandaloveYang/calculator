// 获取计算器元素
const calculator = document.querySelector('.calculator');
// 获取显示屏元素
const display = calculator.querySelector('.screen .output');

// 获取所有按键元素
const keys = calculator.querySelector('.calculator__keys ');

// 定义计算器的初始状态
let displayValue = '0'; // 显示屏上的数字
let firstValue = null; // 第一个操作数
let operator = null; // 运算符
let secondValue = false; // 是否输入了第二个操作数
display.textContent = displayValue;
// 监听按键点击事件

keys.addEventListener('click', function (event) {
    // 获取被点击的元素
    const key = event.target;
    // 获取元素上的data-action属性值
    const action = key.dataset.action;
    // 获取元素上的文本内容
    const keyContent = key.textContent;
    // 获取显示屏上的数字
    const displayedNum = display.textContent;

    // 如果点击的是数字键
    if (!action) {
        // 如果显示屏上是0或者已经输入了运算符
        if (displayedNum === '0' || secondValue) {
            // 用按键上的数字替换显示屏上的数字
            display.textContent = keyContent;
            // 设置第二个操作数为true
            secondValue = true;
        } else {
            // 否则，在显示屏上追加按键上的数字
            display.textContent = displayedNum + keyContent;
        }
    }

    // 如果点击的是小数点键
    if (action === 'decimal') {
        // 如果显示屏上没有小数点
        if (!displayedNum.includes('.')) {
            // 在显示屏上追加小数点
            display.textContent = displayedNum + '.';
        } else if (secondValue) {
            // 如果已经输入了运算符，重置显示屏为0.
            display.textContent = '0.';
        }
    }

    // 如果点击的是运算符键
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        // 如果已经输入了第一个操作数和运算符，并且又输入了新的运算符
        if (firstValue && operator && secondValue) {
            // 计算结果并更新显示屏
            display.textContent = calculate(firstValue, operator, displayedNum);
        }
        // 把显示屏上的数字赋值给第一个操作数
        firstValue = display.textContent;
        // 把按键上的运算符赋值给operator变量
        operator = action;
        // 设置第二个操作数为false
        secondValue = false;
    }

    // 如果点击的是等于键
    if (action === 'calculate') {
        // 如果已经输入了第一个操作数和运算符，并且显示屏上不是第一个操作数
        if (firstValue && operator && displayedNum !== firstValue) {
            // 计算结果并更新显示屏
            display.textContent = calculate(firstValue, operator, displayedNum);
        }
    }

    // 如果点击的是清除键
    if (action === 'clear') {
        // 重置计算器的状态
        displayValue = '0';
        firstValue = null;
        operator = null;
        secondValue = false;
        // 更新显示屏为0
        display.textContent = displayValue;
    }
});

// 定义一个计算函数，接收两个操作数和一个运算符，返回计算结果
function calculate(n1, op, n2) {
    // 把操作数转换为数字类型
    let result = 0;
    let num1 = parseFloat(n1);
    let num2 = parseFloat(n2);
    // 根据运算符执行相应的计算
    switch (op) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            result = num1 / num2;
            break;
    }
    // 返回计算结果
    return result;
}