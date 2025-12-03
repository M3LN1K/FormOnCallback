document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы - получаем все элементы формы
    const form = document.getElementById('callbackForm');
    const statusMessage = document.getElementById('statusMessage');
    
    // Группы полей
    const nameGroup = document.getElementById('name-group');
    const phoneGroup = document.getElementById('phone-group');
    const emailGroup = document.getElementById('email-group');
    
    // Поля ввода
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const commentInput = document.getElementById('comment');
    const agreementCheckbox = document.getElementById('agreement');
    
    // Все поля ввода в одном массиве
    const formInputs = [nameInput, phoneInput, emailInput, commentInput];
    
    // Иконки валидации для email
    const emailCheckIcon = emailGroup.querySelector('.checkmark');
    const emailCrossIcon = emailGroup.querySelector('.cross');
    
    // Элементы ошибок
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    const agreementError = document.getElementById('agreementError');
    
    // Кнопка отправки
    const submitBtn = document.querySelector('.submit-btn');
    const customCheckbox = document.querySelector('.custom-checkbox');
    
    // Состояние валидации
    const validationState = {
        name: { isValid: false, touched: false },
        phone: { isValid: false, touched: false },
        email: { isValid: false, touched: false },
        agreement: { isValid: false }
    };
    
    // Инициализация системы DOM
    function initDOM() {
        // Добавляем обработчики для всех полей ввода
        formInputs.forEach(input => {
            // Обработчик фокуса
            input.addEventListener('focus', handleInputFocus);
            
            // Обработчик потери фокуса
            input.addEventListener('blur', handleInputBlur);
            
            // Обработчик ввода
            input.addEventListener('input', handleInput);
        });
        
        // Обработчик для чекбокса
        agreementCheckbox.addEventListener('change', handleAgreementChange);
        
        // Обработчик клика по кастомному чекбоксу
        customCheckbox.addEventListener('click', handleCustomCheckboxClick);
        
        // Обработчик отправки формы
        form.addEventListener('submit', handleFormSubmit);
        
        // Инициализируем телефонное поле
        initPhoneField();
        
        // Первоначальная проверка кнопки
        updateSubmitButton();
    }
    
    // Инициализация телефонного поля
    function initPhoneField() {
        phoneInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.value = '+7';
            }
        });
        
        phoneInput.addEventListener('input', formatPhoneInput);
        
        phoneInput.addEventListener('blur', function() {
            if (this.value === '+7' || this.value === '+7 ') {
                this.value = '';
            }
        });
    }
    
    // Форматирование телефонного ввода
    function formatPhoneInput(e) {
        let value = this.value;
        
        // Удаляем все нецифровые символы кроме +
        let cleanValue = value.replace(/[^\d+]/g, '');
        
        // Обеспечиваем, что начинается с +7
        if (!cleanValue.startsWith('+7')) {
            if (cleanValue.startsWith('7') || cleanValue.startsWith('8')) {
                cleanValue = '+7' + cleanValue.substring(1);
            } else if (/^\d/.test(cleanValue)) {
                cleanValue = '+7' + cleanValue;
            }
        }
        
        // Ограничиваем длину 
        if (cleanValue.length > 12) {
            cleanValue = cleanValue.substring(0, 12);
        }
        
        // Форматируем с пробелами
        let formatted = cleanValue;
        if (cleanValue.length > 2) {
            formatted = '+7 ' + cleanValue.substring(2, 5);
        }
        if (cleanValue.length >= 6) {
            formatted += ' ' + cleanValue.substring(5, 8);
        }
        if (cleanValue.length >= 9) {
            formatted += ' ' + cleanValue.substring(8, 10);
        }
        if (cleanValue.length >= 11) {
            formatted += ' ' + cleanValue.substring(10, 12);
        }
        
        this.value = formatted;
    }
    
    // Обработчики событий
    function handleInputFocus(e) {
        const input = e.target;
        input.classList.add('input-active');
        
        if (input.id === 'email') {
            validationState.email.touched = true;
        }
    }
    
    function handleInputBlur(e) {
        const input = e.target;
        input.classList.remove('input-active');
        
        // Преобразуем текст к нужному формату 
        if (input.id !== 'phone' && input.value) {
            input.value = input.value.toLowerCase();
            input.classList.add('capitalize');
        } else if (input.id !== 'phone') {
            input.classList.remove('capitalize');
        }
        
        // Валидируем поле
        validateField(input);
        updateSubmitButton();
    }
    
    function handleInput(e) {
        const input = e.target;
        
        if (input.id === 'email') {
            validationState.email.touched = true;
        }
        
        // Для поля телефона не преобразовываем в нижний регистр
        if (input.id !== 'phone' && input.value) {
            input.value = input.value.toLowerCase();
            input.classList.add('capitalize');
        }
        
        // Валидируем в реальном времени
        validateField(input);
        updateSubmitButton();
    }
    
    function handleAgreementChange(e) {
        validationState.agreement.isValid = agreementCheckbox.checked;
        updateSubmitButton();
    }
    
    function handleCustomCheckboxClick() {
        agreementCheckbox.checked = !agreementCheckbox.checked;
        validationState.agreement.isValid = agreementCheckbox.checked;
        updateSubmitButton();
    }
    
    // Валидация полей
    function validateField(input) {
        let isValid = false;
        let errorElement = null;
        
        switch(input.id) {
            case 'name':
                isValid = input.value.trim().length > 0;
                errorElement = nameError;
                validationState.name.isValid = isValid;
                break;
                
            case 'phone':
                const phoneValue = input.value.replace(/\s/g, '');
                const phoneRegex = /^\+7\d{10}$/;
                isValid = phoneValue === '' || phoneValue === '+7' || phoneRegex.test(phoneValue);
                errorElement = phoneError;
                validationState.phone.isValid = isValid;
                break;
                
            case 'email':
                const emailValue = input.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailValue === '' || emailRegex.test(emailValue);
                errorElement = emailError;
                validationState.email.isValid = isValid;
                
                // Управление иконками для email
                updateEmailValidationIcons(isValid, emailValue);
                break;
        }
        
        // Обновление состояния ошибки
        if (errorElement) {
            if (input.value.trim() === '') {
                input.classList.remove('field-error');
                errorElement.style.display = 'none';
            } else {
                if (isValid) {
                    input.classList.remove('field-error');
                    errorElement.style.display = 'none';
                } else {
                    input.classList.add('field-error');
                    errorElement.style.display = 'block';
                }
            }
        }
    }
    
    // Обновление иконок валидации для email
    function updateEmailValidationIcons(isValid, emailValue) {
        // Скрываем обе иконки
        if (emailCheckIcon) emailCheckIcon.style.opacity = '0';
        if (emailCrossIcon) emailCrossIcon.style.opacity = '0';
        
        // Показываем соответствующую иконку если поле было "тронуто"
        if (validationState.email.touched && emailValue !== '') {
            if (isValid) {
                // Показываем черную галочку
                if (emailCheckIcon) emailCheckIcon.style.opacity = '1';
            } else {
                // Показываем ярко-розовый крестик
                if (emailCrossIcon) emailCrossIcon.style.opacity = '1';
            }
        }
    }
    
    // Проверка условий для активации кнопки
    function updateSubmitButton() {
        const nameFilled = nameInput.value.trim().length > 0;
        const phoneFilled = phoneInput.value.trim().length > 0 && phoneInput.value.trim() !== '+7';
        const emailFilled = emailInput.value.trim().length > 0;
        const agreementChecked = agreementCheckbox.checked;
        
        // Условия: (Имя+Телефон ИЛИ Имя+Email) И чекбокс
        const namePhoneValid = nameFilled && phoneFilled;
        const nameEmailValid = nameFilled && emailFilled;
        
        const isFormValid = (namePhoneValid || nameEmailValid) && agreementChecked;
        
        submitBtn.disabled = !isFormValid;
    }
    
    // Обработчик отправки формы
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Сбрасываем все ошибки
        resetAllErrors();
        
        // Валидация всех полей
        let isValid = true;
        
        // Валидация имени
        if (!nameInput.value.trim()) {
            showError(nameInput, nameError, 'Пожалуйста, введите ваше имя');
            isValid = false;
        }
        
        // Валидация телефона
        const phoneValue = phoneInput.value.replace(/\s/g, '');
        if (phoneValue !== '' && phoneValue !== '+7') {
            const phoneRegex = /^\+7\d{10}$/;
            if (!phoneRegex.test(phoneValue)) {
                showError(phoneInput, phoneError, 'Пожалуйста, введите корректный номер телефона (+7 и 10 цифр)');
                isValid = false;
            }
        }
        
        // Валидация email
        const emailValue = emailInput.value.trim();
        if (emailValue !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                showError(emailInput, emailError, 'Пожалуйста, введите корректный email');
                isValid = false;
            }
        }
        
        // Проверка комбинаций полей
        const nameFilled = nameInput.value.trim().length > 0;
        const phoneFilled = phoneValue !== '' && phoneValue !== '+7';
        const emailFilled = emailInput.value.trim().length > 0;
        
        const namePhoneValid = nameFilled && phoneFilled;
        const nameEmailValid = nameFilled && emailFilled;
        
        if (!(namePhoneValid || nameEmailValid)) {
            showError(nameInput, nameError, 'Заполните Имя вместе с Телефоном или E-mail');
            isValid = false;
        }
        
        // Валидация согласия
        if (!agreementCheckbox.checked) {
            agreementError.style.display = 'block';
            isValid = false;
        }
        
        // Если форма валидна, отправляем данные
        if (isValid) {
            submitForm();
        }
    }
    
    // Функция сброса всех ошибок
    function resetAllErrors() {
        // Скрываем все сообщения об ошибках
        const errorElements = [nameError, phoneError, emailError, agreementError];
        errorElements.forEach(error => {
            if (error) error.style.display = 'none';
        });
        
        // Убираем стили ошибок
        formInputs.forEach(input => {
            input.classList.remove('field-error');
        });
        
        // Скрываем иконки валидации
        if (emailCheckIcon) emailCheckIcon.style.opacity = '0';
        if (emailCrossIcon) emailCrossIcon.style.opacity = '0';
    }
    
    // Функция показа ошибки
    function showError(input, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (input) {
            input.classList.add('field-error');
            
            // Для email также показываем крестик
            if (input.id === 'email' && emailCrossIcon) {
                emailCrossIcon.style.opacity = '1';
            }
        }
    }
    
    // Функция отправки формы
    function submitForm() {
        submitBtn.classList.add('active');
        
        // Имитация отправки
        setTimeout(function() {
            showStatus('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Сброс формы
            resetForm();
            
        }, 1000);
    }
    
    // Сброс формы
    function resetForm() {
        // Очистка формы
        form.reset();
        
        // Убираем классы
        formInputs.forEach(input => {
            input.classList.remove('capitalize', 'field-error', 'input-active');
        });
        
        // Скрываем все иконки валидации
        if (emailCheckIcon) emailCheckIcon.style.opacity = '0';
        if (emailCrossIcon) emailCrossIcon.style.opacity = '0';
        
        // Скрываем все сообщения об ошибках
        const errorElements = [nameError, phoneError, emailError, agreementError];
        errorElements.forEach(error => {
            if (error) error.style.display = 'none';
        });
        
        // Сбрасываем состояние
        Object.keys(validationState).forEach(key => {
            if (validationState[key].touched !== undefined) {
                validationState[key].touched = false;
            }
            validationState[key].isValid = false;
        });
        
        // Блокируем кнопку
        submitBtn.disabled = true;
        
        // Убираем класс active через некоторое время
        setTimeout(function() {
            submitBtn.classList.remove('active');
        }, 2000);
    }
    
    // Функция показа статуса
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';
        
        switch(type) {
            case 'success':
                statusMessage.classList.add('status-success');
                break;
            case 'error':
                statusMessage.classList.add('status-error');
                break;
            case 'info':
                statusMessage.classList.add('status-info');
                break;
        }
        
        statusMessage.style.display = 'block';
        
        // Автоматическое скрытие сообщения через 5 секунд
        setTimeout(function() {
            statusMessage.style.display = 'none';
        }, 5000);
    }
    
    // Инициализация при загрузке страницы
    initDOM();
});