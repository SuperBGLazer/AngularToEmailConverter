export class CSSUtil {

    /**
     * Extract all the classes from the CSS.
     * @param css The css.
     * @private
     */
    private static extractCssClasses(css: string): Map<string, string> {
        const result = new Map<string, string>();
        let mode: Mode = Mode.FIND_CLASS;
        let currentClassName = '';
        let content = '';

        // todo Check if the CSS is valid

        // Loop over all the characters
        for (let i = 0; i < css.length; i++) {

            switch (mode) {
                case Mode.FIND_CLASS:
                    // Find the css class that start with "."
                    if (css[i] === '.') {
                        mode = Mode.READ_CLASS_NAME;
                    }
                    break;

                case Mode.READ_CLASS_NAME:
                    // Find the starting curly bracket
                    if (css[i] == '{') {
                        mode = Mode.READ_CONTENT;
                    } else {
                        // Add the current character to the currentClassName
                        currentClassName += css[i];
                    }
                    break;

                case Mode.READ_CONTENT:
                    // Find the ending curly bracket
                    if (css[i] == '}') {
                        // Put the date in the map
                        content = content.trim();
                        if (content[-1] != ';') {
                            content += ';';
                        }

                        result.set(currentClassName.trim(), content.trim());

                        // Reset the variables
                        currentClassName = '';
                        content = '';
                        mode = Mode.READ_CLASS_NAME;
                    } else if (css[i] != '\r' && css[i] != '\n' && css[i] != '\0') {
                        content += css[i];
                    }
                    break;
            }
        }

        if (mode != Mode.FIND_CLASS) {
            throw new InvalidCssError();
        }

        return result;
    }

    private static extractCssTagStyle(): Map<string, string> {


        return undefined
    }
}

class InvalidCssError extends Error {

}

enum Mode {
    FIND_CLASS,
    READ_CLASS_NAME,
    READ_CONTENT
}