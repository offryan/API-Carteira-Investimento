let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url) {
    await fetch(url)
        .then(resp => resp.json())
        .then(json => fii_user = json);
    carregarDadosFundos();
    console.log(fii_user)
}

async function carregarDadosFundos() {

    for (let fii of fii_user) {
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
            .then(resp => resp.json());
        fii_table.push(json);
    }
    console.log(fii_table)
    exibirTabela();
}

carregarDadosUser("json/fii.json");

function exibirTabela() {

    let out = '';
    let placeholder = document.querySelector("#data-output");
    for (let i = 0; i < fii_user.length; i++) {

        let nome = `${fii_user[i].nome}`;
        let segmento = `${fii_table[i].segmento}`;
        let proxProv;
        let cotAtual = fii_table[i].valorAtual;
        let qtdeCotas = `${fii_user[i].qtde}`;
        let dataBase = '';
        let dataPag = '';
        let totalgasto = `${fii_user[i].totalgasto}`;
        let precMed = fii_user[i].totalgasto / fii_user[i].qtde;
        let dividendYield = `${fii_table[i].dividendYield}`;

        // === (Valor e Tipo igual) - é usado para a comparação entre duas variáveis, mas isso irá verificar o tipo estrito, o que significa que ele irá verificar o tipo de dados e comparar dois valores.

        // EXEMPLO: 

        // Para x= 10 temos que :
        // x ===    8  -> retorna false
        // x ===   10   -> retorna true
        // x === "10" -> retorna false

        if (fii_table[i].proximoRendimento.rendimento === '-') {

            proxProv = fii_table[i].ultimoRendimento.rendimento;
        } else {

            proxProv = fii_table[i].proximoRendimento.rendimento;
        }
        if (fii_table[i].proximoRendimento.dataBase === '-') {

            dataBase = `${fii_table[i].ultimoRendimento.dataBase}`;
        } else {

            dataBase = `${fii_table[i].proximoRendimento.dataBase}`;
        }

        if (fii_table[i].proximoRendimento.dataPag === '-') {

            dataPag = `${fii_table[i].ultimoRendimento.dataPag}`;
        } else {

            dataPag = `${fii_table[i].proximoRendimento.dataPag}`;
        }

        // CALCULO RENDIMENTO

        let rendimento = proxProv * 100 / cotAtual;

        out += `
                    <tr>
                       <td>    ${nome.toUpperCase()}</td>
                       <td>    ${segmento}</td>
                       <td>    ${dataBase}</td>
                       <td>    ${dataPag}</td>   
                       <td>R$: ${proxProv.toFixed(2)}</td>
                       <td>R$: ${cotAtual.toFixed(2)}</td>
                       <td>    ${qtdeCotas}</td>
                       <td>R$: ${totalgasto}</td>
                       <td>R$: ${precMed.toFixed(2)}</td>
                       <td>    ${rendimento.toFixed(2)}%</td>
                       <td>    ${dividendYield}%</td>        
                       <td>R$: ${fii_table[i].rendimentoMedio24M.toFixed(2)}</td >    
                    </tr >
        `;
            } placeholder.innerHTML = out;
       
            let out1 = "";
            let out2 = "";

            // PRÓXIMO PROVENTO

            totalTab1 = document.querySelector("#Total-Provento");
            let proxProv = 0;

            for (let i = 0; i < fii_user.length; i++) {

                proxProv += fii_user[i].qtde * fii_table[i].ultimoRendimento.rendimento;
                provento = proxProv;

                out1 = `${ "R$: ", provento } `;

            } totalTab1.innerHTML = out1;

            // TOTAL COTAS

            totalTab2 = document.querySelector("#Total-Cotas");

            for (let i = 0; i < fii_user.length; i++) {

            // SOMA DAS AÇÕES:

                out2 += `< tr > <td>${"R$:", fii_table[i].qtde}</td></tr > `;

            } totalTab2.innerHTML = out2;

            // TOTAL INVESTIDO

            totalTab3 = document.querySelector("#Total-investido");

            let totalInv = 0;
            let totalQtde = 0;
            let totalProxProv = 0;

            for (let i = 0; i < fii_table.length; i++) {

                totalQtde += fii_user[i].qtde;
                totalProxProv += Number(fii_user[i].qtde + fii_table[i].ultimoRendimento.rendimento); 
                totalInv += fii_user[i].totalgasto;               
            }
            
            let totalCotas = document.querySelector("#Total-Cotas")
            totalCotas.innerHTML = totalQtde;
            totalTab3.innerHTML = "R$" + totalInv.toFixed(2);
            
            let linhasTab = document.querySelectorAll("tr");
            
            // console.log(linhasTab)

            for (linha of linhasTab) {
                let v = Number(linha.children[9].innerText.split("%")[0]) 

            // console.log(v)

                if (v > 0.6) {
                    linha.classList.add('positivo');
                } 
                else if (v <= 0.6){
                    linha.classList.add('negativo');
                }
            }
}
