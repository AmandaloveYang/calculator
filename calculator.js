// 获取计算器元素
const calculator = document.querySelector('.calculator');
// 获取显示屏元素
const display = calculator.querySelector('.screen .output');

// 获取所有按键元素
const keys = calculator.querySelector('.calculator__keys ');

// 获取显示元素
const history = document.getElementById('history');
const output = document.getElementById('output');

// 定义计算器的初始状态
let displayValue = '0'; // 显示屏上的数字
let firstValue = null; // 第一个操作数
let operator = null; // 运算符
let secondValue = false; // 是否输入了第二个操作数
display.textContent = displayValue;
// 监听按键点击事件

keys.addEventListener('click', function (event) {
    // 如果点击的不是按钮，直接返回
    if (!event.target.matches('button')) return;

    const key = event.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = output.textContent;

    // 数字输入逻辑
    if (!action) {
        if (displayedNum === '0' || secondValue) {
            output.textContent = keyContent;
            secondValue = false;
        } else {
            output.textContent = displayedNum + keyContent;
        }
    }

    // 运算符逻辑
    if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
        const operatorSymbol = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        }[action];

        if (firstValue && operator && !secondValue) {
            // 更新运算符
            operator = action;
            history.textContent = `${firstValue} ${operatorSymbol}`;
        } else if (firstValue && operator && secondValue) {
            // 连续运算
            const result = calculate(firstValue, operator, displayedNum);
            firstValue = result;
            operator = action;
            history.textContent = `${result} ${operatorSymbol}`;
            output.textContent = result;
        } else {
            // 第一次输入运算符
            firstValue = displayedNum;
            operator = action;
            history.textContent = `${displayedNum} ${operatorSymbol}`;
        }
        secondValue = true;
    }

    // 等号逻辑
    if (action === 'calculate') {
        if (firstValue && operator) {
            const operatorSymbol = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            }[operator];

            history.textContent = `${firstValue} ${operatorSymbol} ${displayedNum} =`;
            const result = calculate(firstValue, operator, displayedNum);
            output.textContent = result;
            firstValue = null;
            operator = null;
            secondValue = true;
        }
    }

    // 清除逻辑
    if (action === 'clear') {
        history.textContent = '';
        output.textContent = '0';
        firstValue = null;
        operator = null;
        secondValue = false;
    }

    // 添加百分号功能
    if (action === 'percentage') {
        const num = parseFloat(output.textContent);
        const result = num / 100;
        output.textContent = result;
        history.textContent = `${num}% = ${result}`;
    }

    // 添加正负号切换功能
    if (action === 'plusminus') {
        const num = parseFloat(output.textContent);
        output.textContent = (-num).toString();
        if (operator && firstValue) {
            // 如果正在进行计算，更新显示
            const operatorSymbol = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            }[operator];
            history.textContent = `${firstValue} ${operatorSymbol} ${output.textContent}`;
        }
    }

    // 改进小数点逻辑
    if (action === 'decimal') {
        if (!output.textContent.includes('.')) {
            output.textContent = output.textContent + '.';
        }
        secondValue = false;
    }
});

// 改进计算函数
function calculate(n1, op, n2) {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    try {
        let result;
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
                if (num2 === 0) {
                    return '错误';
                }
                result = num1 / num2;
                break;
            default:
                return
        }

        // 处理计算结果
        if (!isFinite(result)) {
            return '错误';
        }

        // 控制小数位数，最多显示8位
        result = parseFloat(result.toFixed(8));

        // 如果结果太大，使用科学计数法
        if (Math.abs(result) > 999999999) {
            return result.toExponential(3);
        }

        return result;
    } catch (error) {
        return '错误';
    }
}

// 添加键盘支持
document.addEventListener('keydown', function (event) {
    const key = event.key;

    // 数字键 0-9
    if (/^[0-9]$/.test(key)) {
        document.querySelector(`button.number:nth-child(${key === '0' ? 17 : parseInt(key) + 6})`).click();
    }

    // 运算符
    const operatorMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide',
        'Enter': 'calculate',
        '=': 'calculate',
        '.': 'decimal',
        'Escape': 'clear'
    };

    if (key in operatorMap) {
        event.preventDefault(); // 防止浏览器默认行为
        document.querySelector(`button[data-action="${operatorMap[key]}"]`).click();
    }
});