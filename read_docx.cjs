const mammoth = require('mammoth');

mammoth.extractRawText({path: "Proposal LIDM RESQ-TEAM NEW (Repaired).docx"})
    .then(function(result){
        var text = result.value; 
        console.log(text.substring(0, 3000)); 
    })
    .done();
