export class Report {
    static #ELEMENT = document.getElementById("report");

    /**
     * Clear the report
     */
    static clear() {
        while (Report.#ELEMENT.firstChild)
            Report.#ELEMENT.removeChild(Report.#ELEMENT.firstChild);
    }

    /**
     * Add a line of text to the report
     * @param {string} text The text to report
     */
    static reportLine(text) {
        Report.#ELEMENT.appendChild(document.createElement("span")).appendChild(document.createTextNode(text));
    }

    /**
     * Report network statistics
     * @param {Network} network The network to report on
     */
    static report(network) {
        Report.clear();

        Report.reportLine("Nodes: " + network.nodeCount);
        Report.reportLine("Depth: " + network.depth.toFixed(2));
    }

    /**
     * Report an invalid tree
     */
    static reportInvalid() {
        Report.clear();

        Report.reportLine("The network was too large to render.");
    }
}