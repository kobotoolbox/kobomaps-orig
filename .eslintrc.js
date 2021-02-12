module.exports = {
    "env": {
        "es6": true
    },
    plugins: ["react"],
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        ecmaFeatures: {"jsx": true},
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error",4],
        "linebreak-style": ["error","unix"],

        "quotes": ["error","single"],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "semi": ["error","always"]

    }
};
