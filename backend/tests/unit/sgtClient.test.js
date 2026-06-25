// Testes do parser de resposta do SGT (sem I/O de rede).
const { parseItems } = require('../../utils/sgtClient');

// Resposta RPC/literal típica do SGT (SOAP-ENC array, com atributos xsi:type).
const RESP = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://www.cnj.jus.br/sgt/sgt_ws.php" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
<SOAP-ENV:Body>
<ns1:pesquisarItemPublicoWSResponse>
<return SOAP-ENC:arrayType="ns1:Item[1]" xsi:type="SOAP-ENC:Array">
<item xsi:type="ns1:Item">
<cod_item xsi:type="xsd:int">280</cod_item>
<cod_item_pai xsi:type="xsd:int">277</cod_item_pai>
<nome xsi:type="xsd:string">Auto de Prisão em Flagrante</nome>
<dscGlossario xsi:type="xsd:string">Comunicação de prisão em flagrante.</dscGlossario>
</item>
</return>
</ns1:pesquisarItemPublicoWSResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

describe('sgtClient - parseItems', () => {
  test('extrai cod_item e nome mesmo com atributos nas tags', () => {
    const items = parseItems(RESP);
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ cod_item: '280', nome: 'Auto de Prisão em Flagrante' });
  });

  test('decodifica entidades XML no nome', () => {
    const xml =
      '<item><cod_item>3402</cod_item><nome>Crimes contra a Fé P&amp;blica</nome></item>';
    expect(parseItems(xml)[0].nome).toBe('Crimes contra a Fé P&blica');
  });

  test('devolve vazio quando não há itens', () => {
    expect(parseItems('<return/>')).toEqual([]);
  });
});
