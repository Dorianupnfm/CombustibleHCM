document.addEventListener('DOMContentLoaded', function() {
    const rechargeButton = document.getElementById('rechargeButton');
    const generateButton = document.getElementById('generateButton');
    const rechargeFormDiv = document.getElementById('rechargeForm');
    const generateFormDiv = document.getElementById('generateForm');
    const formRecarga = document.getElementById('formRecarga');
    const formGenerate = document.getElementById('formGenerate');
    const tbody = document.getElementById('transactionBody');
    const verMas = document.getElementById('verMas');
    const saldoDisplay = document.getElementById('saldo');

    const TRANSACTIONS_KEY = 'transactions';
    const SALDO_KEY = 'saldo';

    let transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY)) || [];
    let saldo = parseFloat(localStorage.getItem(SALDO_KEY)) || 30000;

    generateButton.addEventListener('click', () => toggleForm(rechargeFormDiv, generateFormDiv));
    rechargeButton.addEventListener('click', () => toggleForm(generateFormDiv, rechargeFormDiv));

    formRecarga.addEventListener('submit', handleGenerateSubmit);
    formGenerate.addEventListener('submit', handleRechargeSubmit);
    tbody.addEventListener('click', handleTableClick);
    verMas.addEventListener('click', handleVerMasClick);

    function toggleForm(formToShow, formToHide) {
        formToShow.style.display = 'block';
        formToHide.style.display = 'none';
    }

    function handleRechargeSubmit(event) {
        event.preventDefault();
        const generateAmount = parseFloat(document.getElementById('generateAmount').value);
        saldo += generateAmount;
        updateLocalStorage(SALDO_KEY, saldo);
        updateSaldo();
        formGenerate.reset();
        generateFormDiv.style.display = 'none';
    }

    function handleGenerateSubmit(event) {
        event.preventDefault();
        const newTransaction = {
            id: document.getElementById('recargaId').value,
            fecha: document.getElementById('recargaFecha').value,
            cantidad: parseFloat(document.getElementById('recargaCantidad').value),
            tipo: document.getElementById('recargaTipo').value,
            verificado: false
        };
        transactions.unshift(newTransaction);
        updateLocalStorage(TRANSACTIONS_KEY, transactions);
        saldo += newTransaction.cantidad;
        updateLocalStorage(SALDO_KEY, saldo);
        updateSaldo();
        formRecarga.reset();
        rechargeFormDiv.style.display = 'none';
        updateTable();
    }

    function handleTableClick(event) {
        if (event.target.classList.contains('ver-button')) {
            const row = event.target.closest('tr');
            generateTransactionFile(row);
        } else if (event.target.classList.contains('delete-button')) {
            const index = event.target.getAttribute('data-index');
            transactions.splice(index, 1);
            updateLocalStorage(TRANSACTIONS_KEY, transactions);
            updateTable();
        }
    }

    function handleVerMasClick(event) {
        event.preventDefault();
        populateTable(transactions);
        verMas.style.display = 'none';
    }

    function generateTransactionFile(row) {
        const rowData = `
            Id: ${row.cells[0].textContent}\n
            Fecha: ${row.cells[1].textContent}\n
            Cantidad: ${row.cells[2].textContent}\n
            Tipo: ${row.cells[3].textContent}
        `;
        const blob = new Blob([rowData], { type: 'text/plain' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `transaccion_${row.cells[0].textContent}.txt`;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function updateSaldo() {
        saldoDisplay.textContent = `SALDO: L. ${saldo.toFixed(2)}`;
    }

    function updateTable() {
        populateTable(transactions.slice(0, 10));
        verMas.style.display = transactions.length > 10 ? 'block' : 'none';
    }

    function populateTable(data) {
        tbody.innerHTML = '';
        data.forEach((transaction, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.fecha}</td>
                <td>${transaction.cantidad}</td>
                <td>${transaction.tipo}</td>
                <td>${transaction.verificado ? 'Verificado' : 'No verificado'}</td>
                <td>
                    <button class="ver-button">Ver</button>
                    <button class="delete-button" data-index="${index}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(newRow);
        });
    }

    function updateLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    updateSaldo();
    updateTable();
});
