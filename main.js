
function Validator (options) {
    // var getParent = function(element, selector){
    //     while(element.parentElement) {
    //         if(element.parentElement.matches(selector)) {
    //             return element.parentElement;
    //         }
    //         element = element.parentElement
    //     }

    // }
    
    
    var selectorRules = {};

    //Hàm thực hiện validate

    function validate(inputElement,rule){

        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        var errorMessage ;

        //lấy ra các rule của seletor
        var rules = selectorRules[rule.selector]

        // Lặp qua và kiểm tra
        for(var i = 0; i < rules.length; i++ ){
            switch(inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i]
                    (inputElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
            }
             errorMessage = rules[i](inputElement.value);
             if(errorMessage)   break;
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }else{
            errorElement.innerText = ""
            inputElement.parentElement.classList.remove('invalid')

        }
        return ! errorMessage
    }


    var formElement = document.querySelector(options.form);
    if(formElement) {

        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;

            //Lặp qua từng rule và validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            var enableInputs = formElement.querySelectorAll('[name]')
            
            if(isFormValid){

                //Trường hợp submit với JS

               if(typeof options.onSubmit === "function") {
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        (values[input.name] = input.value)
                        return values;
                    },{});

                    
                     options.onSubmit(formValues);
                    
               }else{
                formElement.submit()
               }
            }
        }


        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule){

            // Lưu lại rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test]

            }



            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement) {

                //Xử lí khi blur khỏi form

                inputElement.onblur = function() {
                   
                    validate(inputElement,rule);
                }

                // xử lí khi người dùng nhập input
                inputElement.oninput =  function() {
                    var errorElement =  inputElement.parentElement.querySelector(options.errorSelector)

                    errorElement.innerText = ""
                    inputElement.parentElement.classList.remove('invalid')


}
            }

        });
    }
}

// Định nghĩa các rule
// Nguyên tắc của các rule
// Khi có lỗi trả ra message lỗi 
// Không có lỗi thì trả ra không có j cả


Validator.isRequired = function(selector,message) {
    return {
        selector:selector,
        test: function(value){
            return  value ? undefined :message|| "Vui lòng nhập trường này";
                     
        }
    };
}

Validator.isEmail = function(selector,message) {
    return {
        selector:selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined:message|| 'Trường này phải là email'
        }
    };
}

Validator.minLength = function(selector,min,message) {
    return {
        selector:selector,
        test: function(value){
            return value.length >= min ? undefined:message||` Vui lòng nhập tối thiểu ${min} ký tự`
            
        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue,message) {
    return {
        selector:selector,
        test: function(value) {
            
            return value === getConfirmValue() ? undefined : message||'Giá trị nhập vào không chính xác'
        }
    };
}