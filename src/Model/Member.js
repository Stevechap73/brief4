class Member {
  constructor(
    firstName,
    lastName,
    age,
    ville,
    gender,
    role,
    email,
    password,
    gdpr,
    createAt,
    isActive
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.ville = ville;
    this.gender = gender;
    this.role = role;
    this.email = email;
    this.password = password;
    this.gdpr = gdpr;
    this.createAt = createAt;
    this.isActive = isActive;
  }
}
module.exports = { Member };
