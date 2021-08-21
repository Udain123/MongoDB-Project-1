function validateContact(contact) {
    var re = /^[6-9]\d{9}$/;
    return re.test(String(contact).toLowerCase());
  }
  
  export { validateContact };