const buttons = document.querySelectorAll(".bottom a");
const statusBox = document.getElementById("payment-status");
const deliveryUrl = "#";

function showStatus(message, type = "info") {
    if (!statusBox) return;
    statusBox.className = `payment-status ${type}`;
    statusBox.textContent = message;
}

function handlePaymentSuccess(productName) {
    showStatus(`Payment successful! Redirecting you to your file for ${productName}.`, "success");
    window.location.href = deliveryUrl;
}

function triggerPendingReceipt() {
    const pendingReceipt = localStorage.getItem("pendingReceipt");
    if (!pendingReceipt) return;

    const { productName } = JSON.parse(pendingReceipt);
    localStorage.removeItem("pendingReceipt");
    setTimeout(() => handlePaymentSuccess(productName), 700);
}

buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const productName = button.dataset.product || "Digital Product";
        const paymentUrl = button.getAttribute("href");

        if (!paymentUrl || paymentUrl === "#") {
            event.preventDefault();
            showStatus(`Checkout is ready for ${productName}.`, "info");
            setTimeout(() => handlePaymentSuccess(productName), 1500);
            return;
        }

        event.preventDefault();
        localStorage.setItem("pendingReceipt", JSON.stringify({ productName }));
        showStatus(`Redirecting to payment for ${productName}. After confirmation, you will be sent to your file.`, "info");
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
    });
});

window.addEventListener("focus", triggerPendingReceipt);
window.addEventListener("pageshow", triggerPendingReceipt);
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        triggerPendingReceipt();
    }
});
