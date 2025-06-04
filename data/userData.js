// userData.js
export const user = {
  name: 'Shivam Bhagwat',
  mobile: '8767227129',
  photo: 'https://drive.google.com/file/d/1YVWmNUqmDCE7gSfZ5qZcQAnkPJSB3xGj/view?usp=drive_link',
  address: 'Alandi, 412105',
  language: 'English', // Default language

  total_cashflow: [
    { name: 'Expense', amount: 500 },
    { name: 'Income', amount: 700 },
    { name: 'Profit', amount: 100 },
  ],
};

// Function to update user language
export const updateUserLanguage = (language) => {
  user.language = language;
};

// Function to get current language
export const getCurrentLanguage = () => {
  return user.language;
};