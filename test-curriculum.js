const http = require('http');

const fetch = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
};

const verify = async () => {
    try {
        const cbse = await fetch('http://localhost:5000/api/curriculum/metadata?curriculum=CBSE&class=7');
        const icse = await fetch('http://localhost:5000/api/curriculum/metadata?curriculum=ICSE&class=7');
        const ssc = await fetch('http://localhost:5000/api/curriculum/metadata?curriculum=SSC&class=7');

        console.log("CBSE Science Topics:", cbse.topics['Science'] ? cbse.topics['Science'].slice(0, 3) : "N/A");
        console.log("SSC Science Topics:", ssc.topics['General Science'] ? ssc.topics['General Science'].slice(0, 3) : "N/A");
        console.log("ICSE Physics Topics:", icse.topics['Physics'] ? icse.topics['Physics'].slice(0, 3) : "N/A");

    } catch (e) {
        console.error("Error:", e.message);
    }
};

verify();
