document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('callbackForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.querySelector('.submit-btn');
    const inputs = document.querySelectorAll('.form-input');
    const agreement = document.getElementById('agreement');
    const checkboxGroup = document.querySelector('.checkbox-group');
    const customCheckbox = document.querySelector('.custom-checkbox');
    
    // Элементы для проверки условий
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    // Обработчик клика по кастомному чекбоксу
    customCheckbox.addEventListener('click', function() {
        agreement.checked = !agreement.checked;
        validateField(agreement);
        checkSubmitButton();
    });
    
    // Добавляем обработчики для изменения текста в полях ввода
    inputs.forEach(input => {
        // Обработчик фокуса - делает текст жирным
        input.addEventListener('focus', function() {
            this.classList.add('input-active');
        });
        
        // Обработчик потери фокуса - убирает жирный текст и проверяет валидацию
        input.addEventListener('blur', function() {
            this.classList.remove('input-active');
            
            // Преобразуем текст к нужному формату
            if (this.value) {
                this.value = this.value.toLowerCase();
                this.classList.add('capitalize');
            } else {
                this.classList.remove('capitalize');
            }
            
            // Проверяем валидацию поля
            validateField(this);
            checkSubmitButton();
        });
        
        // Обработчик ввода - сразу преобразует текст и проверяет валидацию
        input.addEventListener('input', function() {
            if (this.value) {
                this.value = this.value.toLowerCase();
                this.classList.add('capitalize');
            }
            
            // Проверяем валидацию в реальном времени
            validateField(this);
            checkSubmitButton();
        });
    });
    
    // Обработчик для чекбокса
    agreement.addEventListener('change', function() {
        validateField(this);
        checkSubmitButton();
    });
    
    // Функция проверки условий для активации кнопки
    function checkSubmitButton() {
        const nameFilled = nameInput.value.trim().length > 0;
        const phoneFilled = phoneInput.value.trim().length > 0;
        const emailFilled = emailInput.value.trim().length > 0;
        const agreementChecked = agreement.checked;
        
        // Условия: (Имя+Телефон ИЛИ Имя+Email) И чекбокс
        const namePhoneValid = nameFilled && phoneFilled;
        const nameEmailValid = nameFilled && emailFilled;
        
        const isFormValid = (namePhoneValid || nameEmailValid) && agreementChecked;
        
        submitBtn.disabled = !isFormValid;
    }
    
    // Функция валидации поля
    function validateField(field) {
        const fieldId = field.id;
        const checkIcon = document.getElementById(fieldId + 'Check');
        const crossIcon = document.getElementById(fieldId + 'Cross');
        const errorElement = document.getElementById(fieldId + 'Error');
        
        // Скрываем обе иконки
        if (checkIcon) checkIcon.style.opacity = '0';
        if (crossIcon) crossIcon.style.opacity = '0';
        
        // Убираем класс ошибки
        field.classList.remove('field-error');
        if (fieldId === 'agreement') {
            checkboxGroup.classList.remove('checkbox-error');
        }
        if (errorElement) errorElement.style.display = 'none';
        
        let isValid = false;
        
        // Проверяем в зависимости от типа поля
        switch(fieldId) {
            case 'name':
                isValid = field.value.trim().length > 0;
                break;
            case 'phone':
                const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
                isValid = field.value.trim() === '' || phoneRegex.test(field.value.replace(/\s/g, ''));
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = field.value.trim() === '' || emailRegex.test(field.value);
                break;
            case 'agreement':
                isValid = field.checked;
                break;
            default:
                isValid = true;
        }
        
        // Показываем соответствующую иконку
        if (field.value.trim() !== '' || fieldId === 'agreement') {
            if (isValid) {
                if (checkIcon) checkIcon.style.opacity = '1';
            } else {
                if (crossIcon) crossIcon.style.opacity = '1';
                field.classList.add('field-error');
                if (fieldId === 'agreement') {
                    checkboxGroup.classList.add('checkbox-error');
                }
                if (errorElement) errorElement.style.display = 'block';
            }
        }
    }
    
    // Валидация формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Сброс предыдущих ошибок
        resetErrors();
        
        // Валидация полей
        let isValid = true;
        
        // Валидация имени
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError(name, 'nameError', 'Пожалуйста, введите ваше имя');
            isValid = false;
        }
        
        // Валидация телефона (только если заполнен)
        const phone = document.getElementById('phone');
        if (phone.value.trim() !== '') {
            const phoneRegex = /^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
                showError(phone, 'phoneError', 'Пожалуйста, введите корректный номер телефона');
                isValid = false;
            }
        }
        
        // Валидация email (только если заполнен)
        const email = document.getElementById('email');
        if (email.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showError(email, 'emailError', 'Пожалуйста, введите корректный email');
                isValid = false;
            }
        }
        
        // Проверка комбинаций полей
        const nameFilled = name.value.trim().length > 0;
        const phoneFilled = phone.value.trim().length > 0;
        const emailFilled = email.value.trim().length > 0;
        
        const namePhoneValid = nameFilled && phoneFilled;
        const nameEmailValid = nameFilled && emailFilled;
        
        if (!(namePhoneValid || nameEmailValid)) {
            showError(name, 'nameError', 'Заполните Имя вместе с Телефоном или E-mail');
            isValid = false;
        }
        
        // Валидация согласия
        if (!agreement.checked) {
            showError(agreement, 'agreementError', 'Необходимо ваше согласие');
            isValid = false;
        }
        
        // Если форма валидна, отправляем данные
        if (isValid) {
            submitForm();
        }
    });
    
    // Функция показа ошибки
    function showError(field, errorId, message) {
        if (field.type === 'checkbox') {
            checkboxGroup.classList.add('checkbox-error');
        } else {
            field.classList.add('field-error');
        }
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Показываем крестик
        const crossIcon = document.getElementById(field.id + 'Cross');
        if (crossIcon) crossIcon.style.opacity = '1';
    }
    
    // Функция сброса ошибок
    function resetErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
        
        const fieldErrors = document.querySelectorAll('.field-error');
        fieldErrors.forEach(element => {
            element.classList.remove('field-error');
        });
        
        checkboxGroup.classList.remove('checkbox-error');
        
        const crossIcons = document.querySelectorAll('.cross-icon');
        crossIcons.forEach(icon => {
            icon.style.opacity = '0';
        });
    }
    
    // Функция отправки формы
    function submitForm() {
        // Добавляем класс active для кнопки (тускло-серый)
        submitBtn.classList.add('active');
        
        // Здесь будет код для отправки данных в Bitrix24
        // В реальном проекте используется BX.ajax.runComponentAction или BX.ajax.runAction
        
        // Имитация отправки
        setTimeout(function() {
            showStatus('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Очистка формы после успешной отправки
            form.reset();
            
            // Убираем класс capitalize после сброса формы
            inputs.forEach(input => {
                input.classList.remove('capitalize');
            });
            
            // Скрываем все иконки валидации
            const validationIcons = document.querySelectorAll('.validation-icon');
            validationIcons.forEach(icon => {
                icon.style.opacity = '0';
            });
            
            // Блокируем кнопку после отправки
            submitBtn.disabled = true;
            
            // Убираем класс active через некоторое время
            setTimeout(function() {
                submitBtn.classList.remove('active');
            }, 2000);
            
        }, 1000);
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
    
    // Изначальная проверка кнопки
    checkSubmitButton();
});