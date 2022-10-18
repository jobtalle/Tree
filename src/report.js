export class Report {
    static #ELEMENT = document.getElementById("report");

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
        while (Report.#ELEMENT.firstChild)
            Report.#ELEMENT.removeChild(Report.#ELEMENT.firstChild);

        Report.reportLine("Nodes: " + network.nodeCount);
        Report.reportLine("Depth: " + network.depth.toFixed(2));
    }
}