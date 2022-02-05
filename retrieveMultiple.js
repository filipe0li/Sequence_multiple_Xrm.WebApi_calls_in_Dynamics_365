const rec1 = () => {
    return new Promise(
        (resolve, reject) => {
            Xrm.WebApi.retrieveMultipleRecords("account", `?$select=_ownerid_value&$top=1`).then(
                (result) => {
                    if (result.entities.length > 0) { resolve(result.entities); }
                    else { reject(`ERRO: não chegou nada P1!`) }
                },
                (error) => { reject(error.message) });
        });
}
const rec2 = (entities) => {
    return new Promise(
        (resolve, reject) => { // FETCH S2
            const fetchXml =`?fetchXml=<fetch top='1'><entity name='systemuser'><attribute name='internalemailaddress'/><filter><condition attribute='systemuserid' operator='eq' value='${entities[0]["_ownerid_value"]}'/></filter></entity></fetch>`
            Xrm.WebApi.retrieveMultipleRecords("systemuser", fetchXml).then(
                (result) => {
                    if (result.entities.length > 0) { resolve(result.entities); }
                    else { reject(`ERRO: não chegou nada P2!`) }
                },
                (error) => { reject(error.message) });
        });
}
const rec3 = (entities) => {
    return new Promise(
        (resolve, reject) => {
            Xrm.WebApi.retrieveMultipleRecords("contact", `?$select=lastname&$filter=emailaddress1 eq '${entities[0]["internalemailaddress"]}'&$top=1`).then(
                (result) => {
                    if (result.entities.length > 0) { resolve(result.entities); }
                    else { reject(`ERRO: não chegou nada P3!`) }
                },
                (error) => { reject(error.message) });
        });
}
const resposta = await rec1().then(
    entities => rec2(entities) // recomendado o uso de funções para melhor organização do código.
).then(
    entities => rec3(entities) // Mas o código também pode ser inserido aqui ex.:  entities => return new Promise((resolve, reject) => {resolve(entities > 0)})
).then(
    entities => entities[0]["lastname"]
).catch(
    error => console.log(`ERRO: ${error}`)
);
console.log(resposta);
