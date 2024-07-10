document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('transactionBody');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Actualizar la tabla con todos los registros
    function updateTable() {
        tbody.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.fecha}</td>
                <td>${transaction.cantidad}</td>
                <td>${transaction.tipo}</td>
                <td>${transaction.verificado ? 'Verificado' : 'No verificado'}</td>
                <td>
                    <button class="ver-button">Ver</button>
                    <button class="verificar-button" data-index="${index}">Verificar</button>
                </td>
            `;
            tbody.appendChild(newRow);
        });
    }

    // Generar archivo de transacción
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

    // Verificar transacción
    function verifyTransaction(index) {
        transactions[index].verificado = true;
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateTable();
    }

    // Manejar clics en los botones Ver y Verificar
    tbody.addEventListener('click', function(event) {
        if (event.target.classList.contains('ver-button')) {
            const row = event.target.closest('tr');
            generateTransactionFile(row);
        } else if (event.target.classList.contains('verificar-button')) {
            const index = event.target.getAttribute('data-index');
            verifyTransaction(index);
        }
    });

    // Inicializar la tabla
    updateTable();
});
