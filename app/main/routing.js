import path from 'path';
import url from 'url';


export default (page) => {
    if (process.env.NODE_ENV == 'development') {
        return url.resolve(HMR_ORIGIN, page);
    } 

    return url.format({
        pathname: path.resolve(__dirname, page),
        protocol: 'file:',
        slashed: true
    })
}
