import axios from 'axios';

// dev ingress: http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
// prod ingress: http://gittix.org

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://gittix.org',
      headers: req.headers
    });
  } else {
    return axios.create({});
  }
};