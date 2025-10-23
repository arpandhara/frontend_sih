// Helper function to get nested values from an object using a dot-notation string
function getTranslation(translations, key) {
    // e.g., key 'states.andhra_pradesh' will look into translations['states']['andhra_pradesh']
    return key.split('.').reduce((obj, i) => (obj ? obj[i] : null), translations);
}

// Function to fetch the language JSON and update the UI
async function setLanguage(lang) {
    try {
        // Construct the path to the language file
        const response = await fetch(`./login_languages/${lang}.json`);
        
        if (!response.ok) {
            console.error(`Language file not found: ${lang}.json`);
            if (lang !== 'en') {
                await setLanguage('en'); // Fallback to English
            }
            return;
        }

        const translations = await response.json();

        // Find all elements that have a 'data-translate-key' attribute
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translation = getTranslation(translations, key); // Use helper function

            if (translation) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    } catch (error) {
        console.error('Error loading or applying language:', error);
    }
}

// Main execution block
document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('languages');

    // Set the initial language (default to English)
    const initialLang = 'en';
    languageSelector.value = initialLang;
    setLanguage(initialLang);

    // Add an event listener to change the language on selection
    languageSelector.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });
});

