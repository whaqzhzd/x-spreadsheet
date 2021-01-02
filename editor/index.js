import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return global.json_worker + './json.worker.js';
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return global.css_worker + './css.worker.js';
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return global.html_worker + './html.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return global.tjs_worker + './ts.worker.js';
        }
        return global.editor_worker + './editor.worker.js';
    }
}

function create_editor(ele, value = "") {
    return monaco.editor.create(ele, {
        value: value,
        language: "javascript",

        glyphMargin: false,
        folding: false,
        lineNumbers: "off",
        workbench: {
            activityBar: {
                visible: false,
            }
        },
        scrollBeyondLastLine: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        lineNumbers: false,
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: "vs-dark",
        scrollbar: {
            arrowSize: 0,
            vertical: "visible",
            horizontal: "visible",
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 0,
            verticalSliderSize: 0,
            horizontalSliderSize: 0,
        },
    });
}

global.create_editor = create_editor;
exports.create_editor = create_editor;