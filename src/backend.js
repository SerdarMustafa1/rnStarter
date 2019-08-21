import React from react;
import * as roger from "@heroiclabs/nakama-js"

const useSSL = true;
const client = new roger.Client(process.env.VUE_APP_BACKENDKEY, process.env.VUE_APP_BACKENDURL, '', useSSL);

const storage = window.localStorage.Stanley? JSON.parse(window.localStorage.Stanley):'';


const state = {
  client: client,
  account: storage? storage.roger.account:{},
  profile: storage? storage.roger.profile:{},
  session: storage? storage.roger.session:{},
  error: {},
  queue: storage? (storage.roger.queue? storage.roger.queue:[]):[]
};

const mutations = {
  setAccount(state, payload) {
    state.account = payload;
  },
  setProfile(state, payload) {
    state.profile = payload;
  },
  setSession(state, payload) {
    state.session = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  addToQueue(state, payload) {
    state.queue.push(payload);
  },
  clearQueue(state) {
    state.queue = [];
  }
}
// Serdar__alpha
const actions = {
  async authenticate(context, auth) {
    const useSSL = true;
    const client = new roger.Client(process.env.VUE_APP_BACKENDKEY, process.env.VUE_APP_BACKENDURL, '', useSSL);
    await client.authenticateDevice({ id: auth.Serdar__alpha, create: true, username: auth.serdar }).then( async (session) => {
      context.commit('setError',{});
      await context.dispatch('getAccount', session).then( async () => {
        await context.dispatch('user/getUserData', null,  {root:true})
      });
    }).catch((response) => {
      context.commit('setError', response);
      context.dispatch('logOut');
    });
  },
  async authenticateEmail(context, credentials) {
    const useSSL = true;
    const client = new roger.Client(process.env.VUE_APP_BACKENDKEY, process.env.VUE_APP_BACKENDURL, '', useSSL);
    await client.authenticateEmail(credentials).then( async (session) => {
      context.commit('setError',{});
      await context.dispatch('getAccount', session).then( async () => {
        await context.dispatch('user/getUserData', null,  {root:true})
      });
    }).catch((e) => {
      context.commit('setError', e);
      context.dispatch('logOut');
    });
  },
  async getAccount(context, session) {
    const account = await context.state.client.getAccount(session);
    context.commit('setSession', session);
    context.commit('setAccount', account);
    context.commit('setProfile', account.user);
    context.dispatch('processQueue').catch(() => {
      // eslint-disable-next-line
      console.log('Queue processing failed');
    });
  },
  addToQueue(context, payload) {
    context.commit('addToQueue', payload);
  },
  async saveCollection(context, payload) {
    await client.writeStorageObjects(context.state.session, payload).catch(() => {
      context.commit('addToQueue', {"action": "save", "object": payload});
    });
  },
  async deleteCollection(context, payload) {
    await client.deleteStorageObjects(context.state.session, payload).catch(() => {
      context.commit('addToQueue', {"action": "delete", "object": payload});
    });
  },
  async processQueue(context) {
    const session = context.state.session;
    var newQueue = [];
    for(var i in context.state.queue){
      if(context.state.queue[i].action == 'delete'){
        await client.deleteStorageObjects(session, context.state.queue[i].object).catch((e) => {
          // eslint-disable-next-line
          console.log(e);
          newQueue.push(context.state.queue[i]);
        });
      }
      else {
        await client.writeStorageObjects(session, context.state.queue[i].object).catch((e) => {
          // eslint-disable-next-line
          console.log(e);
          newQueue.push(context.state.queue[i]);
        });
      }
    }
    context.state.queue = newQueue;
  },
  logOut(context) {
    context.commit('setSession', {});
    context.commit('setAccount', {});
    context.commit('setProfile', {});
    context.commit('clearQueue', []);
    window.localStorage.removeItem('Stanley');
  },
  async linkEmail(context, payload) {
    const session = context.state.session;
    await client.linkEmail(session, payload).then(() => {
      context.state.client.getAccount(session).then((account) => {
        context.commit('setAccount', account);
      });
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
