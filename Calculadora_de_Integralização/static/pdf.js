/**
 * Função responsável por gerar o PDF da simulação.
 * Recebe os dados necessários como parâmetros para manter o desacoplamento.
 * * @param {Array} materiasSelecionadas - Array de objetos das matérias
 * @param {String} totalCreditos - Texto com o total de créditos
 * @param {String} novaIntegralizacao - Texto com a nova porcentagem
 */
async function gerarPDFSimulacao(materiasSelecionadas, totalCreditos, novaIntegralizacao) {
    
    if (!materiasSelecionadas || materiasSelecionadas.length === 0) {
        alert("Selecione matérias antes de salvar.");
        return;
    }

    // Acessa o jsPDF do objeto window (carregado via CDN)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- CONFIGURAÇÃO DE CORES (Identidade Visual) ---
    const corVerdeEscuro = [0, 51, 34];  // #003322
    const corVerdeMedio = [0, 102, 51];  // #006633
    
    // 1. CABEÇALHO (Retângulo colorido)
    doc.setFillColor(...corVerdeEscuro);
    doc.rect(0, 0, 210, 40, 'F'); // x, y, w, h

    // Texto do Cabeçalho
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Simulação de Integralização", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data da Simulação: ${dataHoje}`, 105, 30, { align: "center" });

    // 2. RESUMO (Estatísticas)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Resumo:", 14, 55);

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Total de Créditos: ${totalCreditos}`, 14, 65);
    doc.text(`Previsão de Integralização: ${novaIntegralizacao}`, 14, 72);

    // 3. TABELA DE MATÉRIAS (AutoTable)
    const colunas = [["Cód.", "Disciplina", "Créditos"]];
    const linhas = materiasSelecionadas.map(m => [m.id, m.nome, m.creditos]);

    doc.autoTable({
        head: colunas,
        body: linhas,
        startY: 85,
        theme: 'grid',
        headStyles: { 
            fillColor: corVerdeMedio, 
            textColor: [255, 255, 255],
            halign: 'center'
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 30 }, // Coluna Código
            1: { cellWidth: 'auto' },               // Coluna Nome
            2: { halign: 'center', cellWidth: 30 }  // Coluna Créditos
        },
        styles: { 
            fontSize: 11,
            cellPadding: 4
        },
        alternateRowStyles: {
            fillColor: [240, 248, 245] // Verde bem claro alternado
        }
    });

    // 4. RODAPÉ
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Integralizei UnB - Ferramenta de Planejamento", 105, pageHeight - 10, { align: "center" });

    // Salva o arquivo
    doc.save("Minha_Simulacao_UnB.pdf");
}