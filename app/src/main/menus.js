import os from 'os'
import * as path from 'path'
import {app, BrowserWindow, Menu, shell, dialog} from 'electron'
import isPlatform from './../common/is-platform'
const nativeImage = require('electron').nativeImage

const appName = app.getName()

function sendAction (action) {
  const win = BrowserWindow.getAllWindows()[0]

  if (isPlatform('macOS')) {
    win.restore()
  }

  win.webContents.send(action)
}

const helpSubmenu = [
  {
    type: 'separator'
  },
  {
    label: `${appName} Website`,
    click () {
      shell.openExternal('https://github.com/terkelg/ramme')
    }
  },
  {
    label: 'Report an Issue...',
    click () {
      const body = `
            <!-- Please succinctly describe your issue and steps to reproduce it. -->

            -

            ${app.getName()} ${app.getVersion()}
            Electron ${process.versions.electron}
            ${process.platform} ${process.arch} ${os.release()}`

      shell.openExternal(`https://github.com/terkelg/ramme/issues/new?body=${encodeURIComponent(body)}`)
    }
  }
]

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click () {
      dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Terkel Gjervig',
        icon: nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAACxKAAAsSgF3enRNAAAAB3RJTUUH4QUPDSIGx0aN5wAAK6tJREFUeNrtfXeUHMd55++r6u4JO5szsFhgkSMRSIBBIqlAUqZoiaQkmnfmSSdblqxwtGXZ57P9FCyf9E48n23ePYfzyfKzrEBQDCIlBkEIRA4kcs6LBTZg8+TYXXV/dJie2VnsLjCziwX5vddvp3tqe6rr+9WXqxp4j97VRFPdgZv4WeVUd3gy6FYDAE3wfDSSEzyftjTdAUAFPrv/0jW+K0TyGn9H+y7/87Si6QiA0Ridf6DA98z+SyACCBLCZq59COv/Cs16kdd2LGDc9DRdAHAtZjNXOxbgFdptFXcG5vkWV9dqDfVlPNDgYd56ldRaTrySgQWIyEOASgAB0pBSpiVE3JBG2JCZYFqkBuIi1jecGezvTF4aPBo9GOlMdiQAGMhltEAWFALTEAw3OwDyxThDdhYDAF8cWFV2Z+UHm2Z4WxeU84plGvMsVkiZy8GaiKiKAD+BFIKkkfJfFhgACQAGIFNSyoiEGDCkfiUtUudiRvRkX/rq6SPRg1f2hHYMp0Uqg1zJ4T4KSYebjm5WABSa5QwAFFKVD9c9VntbYO3SarXuLi/z3amQsoQRNRDgzf6TtG4knRu6z7PXcr+/1sBISENChgypX0qL1KGgPrz3fPzsoQ2Db3ReTXcnkAWCgZFAcAPipqGbDQCFmE4A2L01D1fdVfWhlbVqwwNe5r2fE1/IQOXkzGLpMD6H2RKANMeenOF3fSbXINifCSAaq5sAIHVDGt1pmdo/nBnedCx6ZM8vBn7eGTNiaYwEQj4Ybgq6WQBQkPEBpVL9VNPn2ub7lz5YxgMfV0hZxUAVJpPlyJkuJCBN5hIDuMagehWoZQq0gAK1TIXi4+AaB1MIRARpCIiMgJ7Uocd1ZKIZ6LEM9LgOI2WYc15KEDNR4QaGW5ZIEwyXEiL+1pXk5dd+OfCLQydix8PIAmE0qTDlAz/Vvz+C8c2eVs8TTZ9b3uKd8ykv832ME2sjgFH+LJcm04kkVK8CX50HFS0BVM4tR+WcCpS3lMFX74OnUoNapoB7OJjCTGYyAgGQUkIKU7iLtICe0JGOpJEcSiLeE0ekI4JwewiRSxHEr8aQjmQgDWGCgbmVSPaRBEQ4JVK7e9O9L/xq8FfbdoZ2DMJkvI4sGG4K1TCVAMhnPKvTGrWnZnxlRYu37dNe5n2Ug5qyDHczXYBzgr/Oi5pFVWhYXYf6FTWobKuAt9YLxcuL2lFpSKTDKcS6Yhg+NYSBQ/0YOj6I6JUI9IRu6gs20ooQkMm0SL9zNX31J78cfG3TntAeNxB0FDYYJ50JU/GbbuZzAPzzs/50/kL/ss/6uO9JBtbM8sW8IUEM8Nd50bCqFi33NqNxTT3KW8rAPcVl+FgkhURqKInhU0O4uqsbfXuvItIegp4yHFUBwKWcZCopUrsuJ6/84Ee9P95+IXExClMKuIEwJdJgsgGQz3h6uP6JunurH3qinFd8USG+wHTXLMZbs13xcNQursTsB1ow6/4ZqGyrAFPZDXWkaCSB5GACAwf60LnhEvrevorkYNJ8WJbri0jISNSIvX4kevSf/6n7+8cNaWSQBYFtI0wqCCYLAPbv2OKeVyrV6hdn/dldM7yz/kQj9YMEqM6st3S7VqagaW095j/ahhl3N8JT5ZmscbkuEhmB0JlhXHnjIrp+3YFYV9R6asqJOOjSuNyfGfj+C/0/f35naM8AsiBwqwVgEoAwGQAYoet/s/636u6r/sjvBpTAlzhYU1bHS5Ahofo4ZtzdiEVPzkfTugYoPmUSulk8kkIieimMy6+ex5XXLiLWHTXVgks1SCATF8nNh6NH//bZzn88DCADII2sNJgUlVBqAIzQ9X80+1sr2nwLvu5h2m8QoNizHkKCc6BhVR2WfnohZt43Y9oxPp+klIicD6J9/Wl0vnERqeEUiDNXeJCgS6OjK93z7D90/ctLF5OXojCBkMEkqYRSWk828zkApVGb4fmztu9+fJZ39rMaU+/hkIxBgkGCGQIVLX7c9vvLsOZrq1C3vPbm0fE3MgBE8NT60Pi+mahe2YDMYALxrgjIkFYqCuBEVZVK+X1ry1dXG9I4dS5xMQ5zwkxKGLlUAMiZ9e+r+lD552Y+/eUateY7CrEWBgkOCRISqkKY89As3PXNtWh9YNa0n/UFB4MRylrK0fSBVniqvYheGIYeToMsjDNA9THv6sX++Ysa1PrT+6OHh6wxLLkNUAoA5DD/k41P1T9S//g3ArzsqxwIcGvWkyFQ3uzD6j+4DSu/chvKmsumPixVYuIejpqVDahZ04jk1SgSV8Ig6UgDUkmZ2+qdccci/7wLO0L7euCKOZesT0W+n5v57HdmfGnW+6ru/56feT/NIFWb+UxINN1Rj7u+fSdaH2wF06a/uJ/ICPkay9BwbwsIQOTMEGTacFSCQryxQa27e2Vg2ZUtwZ2XSt2dYgIgh/lfbPlq2+3l6/7Gy7THOGDqeymgcML8R+di7TfWoWpB1S0/60cj7lNQu64Z/uYAwscHoIdTVmhZghOrqlWq7r6j/LaezaFdF6QpAEoiBYoFgBzmf6nlq22ry9f8nYepD3NI4pBgQkDzK1j2+WVY+Ycr4an2TspA38xEjFCxuBaVS+sQPT2AVF/MyS9wokCVUnnXHYEVPb8O7jhv/UvRPYJiAMBt7fPfm/GlWXeUr/0bL1Mfto09JiS8lSpW//EaLPrMYnDPrWfo3Qj5Z5ajek0TYueHkeiKOBlHTqysSqlYtzqw/Mqm4M6LVvOixgduFAA5zH+y8bcb7q2673tepj5u6nuACQF/rQe3//latD0+D4y/i/T9BMhT60PN2mbE24NIdIQtEEhwYmXVSuXtS/0Lzr4V2nvZal40F/FGAOAO8ij3Vd1f/mj9Y9/wM+9nOCQxS+z7a724/S/WofWRNke8vUeFSa30oPqOZsQvDSN+KeSWBBW1atVtszxNR3ZHDvVazd01iNdNNwoADoDXqrWep1ue/nI5L/sqh1RtS99XpWH1n69F6yNt71pjb6KklmumOjg7hMSVEIhsm4DVNmn181VS9h2Lnw1ZzW84Uni9AHAbfcp3537n47Vq9XccP18KaH6O2762BrMfn//ezJ8gqRUeVK5sQORYH1I9UZBVvKKS0tLqnVF1KdW1tyfdn0YRbIHrAUCO3v/mnK+vbPW0/J1C1GL7+QoHFn/+Nsz/zNL3dP51klbtRWBRLULvdCMTTDpxAg/TFizytcXfHN5xSEDccEHJRAGQo/d/q+GTdXeWr33Gw5R7OIQT5Jnz2Dws/YM171n7N0jexjJ4mwMY3t0JkdQBAhiIlzHf0sW+uae3hPZdsppedwn69QCAAVA4ce0PW770lQD3fc5J7BgCDWsbcdvX737Pzy8SlbVVgRgh+HaXU93MiPw1SuUcADuPx8/bhafXJQUmAgC36GfPzP32+xu1uu8qkBX2zA80+7HyL9+HigXVUz1utw4RIbCoFsmuMGKnB0BEVshYaW7RGumt8Dt7kyKVX3E8bpoIAOyCDuXJ+sfr1lWs/p6H+Eo72KOohMV/cDuaH2qb6iG75YipHIGFpj2QHog79oCPe+bN8846tSm07yJGrl0cF40XADlW/9davvjZcu77PINk3BL9Mz8yBwu/vAZMndwCzXcLqVVeaFVeDO/sgMwI2x7wVimBxkE9tP1CsjOG3MWt46LxmuhOSdfXW7+6oIqXfYFDKnaMPzArgHlfWAXuV6d6nG5pqvtwGxofWQiSVkodEn7mWfdk7UOPA9AAqAAUjFwhPSqNBwCO5e9jXm2Jb95nVWILTZdPgHNgzlPLULG4dqrH55YnUjlaPrsSZXMqQUKAzHA7n6nVPfW5hkfnwWS+AqviGuMAwXj8NGdd/bdb/2hlgHt+i1kuHxkCtWubMePRhUV/WJHUkbw0iFT7EPRI0rKA3Y9k1tlKyrs84sRsewPDXvBW7juSc81syzQFWnMFvPProdYUt9DF31aNmU+twIVndpormgB4SJn3oco7nvhB36t/jex6g3HZA2MBwJn9dWq1d453xn9SQM1Obt/PMfvTy6EV0+UTEpEDV9D/3AFED3fBiCTMNX8knYEk12dn9F3n5D53P4lD1xoTKtzEzeQRuwC4/8f8TJoKz6xq1DyyHLUfXwFeUbwxqn9kIQZ+dR7B/d0gK9BWr1Q+9l+aPvXq31998RhMvtqewTVLy8ay2Jwc/7db/3DVDK3uGwpkgEGChED9fa2Y8/k1RSvglEJi8OdH0Pm9jYif7IHUM6bFyyWIZ/+CwTxn1vW8c9tfcb5j0tVmjIPsz+Rccxe1m99Ttp3zl7JrmYkAQyAzGEX0nQ6krgwjsHImeFlx1jVwnwrmURDcfglSmLzlxCqqlYrwS0Nv7UXuymRcLwDclr/2+41PPO1l6ocZJLiUUMsUzP/ju1A2v6YoDwUAoa3n0PnXm2BEEubqXQaASXPgmTnzs0yRzoDnfEfIZZzdzjkf43DaSueac1/34QaG3S7vO7PoUyJ5cQB6MIGKu9pARfKSvM0BRA5fRepyyMkVeJharxDfdjh+bhjjjAtca+o6w/KtWV+aW8a03+RONa+BmrUzULV2ZtGYrw/F0PfDPTCicZAiAS5BzAQykQCYsMAgQExYs9r8nP3O/B5We6cdSau9+3Dfx3WQu73IuZ8JpuxvuO/t/l5KAwSRlTwKENxyCqHt54o2Xrzcg8ZPLgX3cGdRjUbKnPsrVj2IrDHo3k2lII1mA+Qs5Vrqm/OQQtRmG3/cy9H06CLwIpZwRw50IHH+KpgGS69LML+Kqg8sgX9ps6Prsr3LA/Z4Da3CW3+Mn0a0pZxrEoA+GENw0wkkLw06m07ITAbDG0+g6oMLQVpxxq36/bMRWFKP8OEeEGdgADWpNQ/fV7Hqpe3hw93ItQUK9v5aPSEA7InaB6oruO9jdpEHDIHyFfWovqulKA9hU/xEF6Shg1TLiCKJ+ifWovF37gMp0y+jWL6uDR3ffBnp3rC5lwAHUu19yAzGoDVXFuU3lCov6h5egOixqw5nfUxd9mjV+9ZsDx/uhWW/4RqG4Ggj6+y+9VDlulUa8VX2Kh7OJOofnAulqriWvz4cAfGsaOcVGiruXTgtmQ8AvkXN8C9pBixVAC5hJFKmV1NEqr6/Dd7mcicuwEHeed7mBxXiXmRjAqOqgkKjm5PybVKrH1AgyxkEmBTw1vtRfd+coj6ElBKQAuCW7ucSpBHYNE4nE2NgftWyDyw7AQJSTChSOyZ5WitReVeLucDEsgUquP/OJ2s/OBNWzQZyd1rLoWtJAPpCw8fr/Uy73579JAQqVjfBN6fI2T6CM0i5AzbNiVzPUqJnIkao/sBccK/iMgb5rHsCy9YgC4DrkgC4K7B0qUq0wBH/CqH63jmgEizcNH14aaoBbln1dJOAQMpsJHKCz2Q+BxyXthTFcYGVTfC2VoKEtPL1pLRodfcw0JhqIF/GukUFb1Qr7uaAGfiRAp6GAMpXN5dmkAmWO2cujCU+tcyXQiDV3oPooXNIdfYDQkJtqkVg1Xz4FraAlHH48wRHqklpAaIECFDrylC+uhmJswOwbb0K5lv1cNW6uteD+2LIZX6OQVhIyRIA9v7y5QE/09ZxZ/2+QNmiOmgtxbFgR5AjAazwdYkGazwkEikM/nInhjfsgz4ctSSA6c8NvbkHVfevQt0TH4BSGbj2jZy4gbUvYansWQIq1rVg4OUTEFZ+QGN81j2BpfNfD+67gmt4A6OpAHy0cm2zBraY7AWdBARWN4Nppcn325YyeFZfTgX/pW5g4KUtGHh5C4xIBKQCpDKQZm44KxIJDL25G70//BVEIjXGQ7nUgK3SSqTW/EsboNb6LWMQ4CD/HE/jCuQagmMagU6juZ7GhQpRg5135mUKylY0lW7k3dE4GwhTgIDYsXMIbt4LIsPJL8B12PmI8O4jCO8+ds17uY0/J2JYItKayuFrqzb3TbTykjU8sDzAvD7kSoCcUXUDwK0jWDX3L2OAx8y8CagNfnjbSlfrR5RrBJqDNcl2gJCI7DsCI5mwhszOQ+SGi8EAaWQQ3n0E5n7Roz3USACViphPhX9JvWtrPcDPtHl3B5ZUYeQm29n/G9llUAX3e3xMXeyglgS8syuh1PhLN/jmQsLsTJsCN9BIJJDqumoC0eW+5R4mUxkH0r39MEKR0W+Y5waW2q7xLa63AmemFFCJN630z23CiLRVthcFbYBHqu4IqJy3EReANSO9c6tLG5ixxat7wCZZBUjdgNTTriykLDD7rYNLSEOHzOij39DJKNpqoLT9986pBg+ozq6EnKh8tqe+BROUAFhR1lrDOZoc31wFvHOKl/YtOFaUHVjwqXEDmUeDUuG3MomFJYBznSR4wAvmHz0kTo4baI10iUGtNgSg1vhg1yYxkFKnVLQiC4ARIMi3AQgAmj1VDYyjCtaMZF4GbWaJ3D+nJ/kSQEy6BGBeD3yL2nIYP6oEIAHfglng13IF3W6gYwSWDthKhRdqvd/8DQIIEgHmnYlrpIYLqoAK1dvAmPSZETkBXqZArSsrWccJWUPLkQBTYQQCqLj7dmjN9QCM7KzN0/+AgFpdjqr714HYNZx7VsANLCGRV4HaGDBVDpkqx8vUxkru1zBOG4AAkE9VG4hLxS7K4OUaeIWvtCNPMO0Np8hjatxArbkRdZ96BGpNJQAdRCJXKkkDvNyL2k88BN/COWM80+QagcQIan1ZNt5AgEa8pkWr86AA84FsJNB9kTSF1RC33RYBXq6C+Upc8++OAUxxKDiwagV4oAzDG7cieaEdRiIJSIBrHnhaW1D9wH3wr1iCsaw62waAu1ytxH1XavzZcjUhwYlVNKs1vhOJywUDQW6z3kkDq5w5+l9Cggc0sCJVsYw6WLb4t0X/FEUCzc4QfAvmwTt7FtK9fcj0DwJSQqmphtbcCOYdZy0E2YkgCSlQ0jiATUqlF8TJTLETwBn5apWA3WE3CAiALMRVxjnKTIYIkBRmXrvUhRmuuj3AtrRLPl7X7pKmwTOrBZ5Z11n9ZKW5wbJ2TqmfiZWpAAfIkJDmK248FYrPrQLsnkmgcDaQiMPrpGSlBPNyK0tXyp4jmwuASxJMY8oG0uwK5tI/E/MoIG7W11iV0tzLtFH19wgJ4GUqMcsAtAFAaumVV46rdZNIgBt/KDiSzVQBk/CTCgMxQJI034skwVXGR60KGgEARkRgkjlGoBRmUqTkPXfHy0sbN580oqwHYIrWSQA1o2zgV0h7vcKoJWEjAJASuiQuDFjFmRISkAZkiftuegACxE31dGuUhCHr/zOaHFAbwokDSCKApNSlMWoh4ggAGFJIyUTatgFISkihX1dJ1EQHi9wSoAjpYKmbmTpSpmDZur0qySoHk2JyVJrUrZeNkC1xpJHOJizGtS5AChJxxy2TEjKThhQCVMr3S+RVz95QJFAIxE4cQPTgboAI5XfcC/+SVWP67cWmEXGASbBrRDJtW4AAESTJTFQk064mOYOaDwAJQAhmRNxxAJlOAboBaKWbSdlCEGs52/UOlhSIHNyB4Y0vQ8RjAIB0dztEOonAyrsmFwR2JJAsI3ASvAAjmgIgzbeikoSASAb1mF26NOLHC9mlMgN9OJsKlhCpBEQ6jZKSK2yaVQUTJIv5wc0vQabjZimXyiCSUQz/+meIHt1belWW80xwXEAnI1hiMsJxSNh2ACBIxPoyoSRyme98ZnkXJQCZlOkBMCmISZAiIVJJiHiytD3PS5xMuCZQCkQPbkdw84sQ6bi1TNy6nwKIZATDG59H7OieSQOBvWLZjs1PhhegD0ez+yOQhC71YFdqyBQLBfYTZO4T+3PUSPSBiTSs+jeZTsKIREs+WLjeghApED20HcG3XoTMZJmfs+KXAzIZwfCm5xE7NkkgcMUBJiMbKDMGMoMRVwEqkEJmoDMXADlUyAZAfyraJ7mIMk5ekIQ00sgMB1HSfKA7HTwRN1AKRA9vR3DrCxCZBMALrIOUgB0JFakIhjevBwgoW353aW0CyjKenNWWpSMRT5kAcO2WEhepHphbxuRLAHPYC93oXLhvUJAYyGbndGT6+0vb+0I2wFgzRgpEj2xDcNvPnJlfcL2/u7CTk2kTbF6P2PHdJZQEThDGtbtIacvC9GAcRtDaXNpUO3JYj13ByHcQXtMGwPbuiyGD9E5YVbpgApm+XqDICxvdRCNsgLHGVyB6dBtC21+AzMRdVbwjizhzzm11kIoguGU9YifGDwJpGIifPoShN9cjvGcTjFh4jIfKegGlXBNgU/rqMIxY0in9EJCJrtRQJ66xW0ghFSAP9nUlUjJzzs/4A3YYM9PfByORBC8rUWWwywYYMxQsBWJHtyG0w575oyx/lzRi0LO8NtVB8K31AICyZfdcUx1IYSDyzmYEt/4CIpEAEUfq8jnUfPQ/gpdXFX4kOxhjG7TMHuLSULKjDzKTARGHJMCAMXQq1tWN7AaSI0BQaJ4JAHpYT54Ek5K46QnooSHow0Ml63x+5cyoQRMpEDu2FaGdz0NmYqPMfBQo55Jwp5xNw5AgkhEEtz6H2MnRJYHJ/E0IbXsFMpM0U+MMiJ86iKHXfwojEiz8TE4oGNnIXIlIConkhaswVY+papIy3bkveGEQudvI5g57/n3sozMaPC2ZCJnFmoBIxpDu7ixN7x1dOUYcQArEjm9FaNfzkHoMxKnA3j8YsS/QSCDAtdLHVAehrT9FvAAIpDAQ3b8JoR2vQBqpnJ3HwIH4mUMYemMUENihYLcKKJENYIRiSHb0uir/JMJ64vT5WG8UE7ABnL+7uzo6dDI6sqVhOpIdF8fTl+ujQhIgZ/MdgdiJtxDavR5Sj5vWfs5sR3bWUy7DcwGBXCOTmYkakYoiuO2niJ/c5YBACgPRAxsR2vlzQE/l+PRuyz5+ehQQuIFm97VElOocQKYvaL6dhSQkSaMrNXQMua+kH78E+P6hA0NJkT6SXbcvke66BCMWGbMz10OOrrTXBLhVgMX88J71ps4vsFyLRjA6rxrXZkCet5EFBEybYPtziJ/aBWnoiB7ciNDun0MaKUfVuLeuc845ED9zcAQIyB38KbEKiJ+8DJFMOtJUl8bAoVDHaeTuGTjCDSyYDLIap4eSsT1VZepTYODEgMxwL9I9nfDNX1ICBORmA91xgNjJtxDeu36kwZcvTmXuNXJft6ugJLLv4SSCnec2w/SWYbhjPZKXjiJx8SigJ0GMmTV21j3IfVv7dxghfuYgAKDmo79tGoYuxssxN2y7fhKpDGLH22HrfxAhLlJnf9V7rAsm860U4ThzAbDQcrSv95BBosdODUs9ieSFU6V5ivyVN1YxSvzkZoT3PQepFzD4KO8oqO/lCNXgjg3ktyEGyGQY8bN7IPWEk8fPlSoYRRqYIBh605IELhXgTg8Xm9Kd/Ui291ji32Rhbyr8Tnt8wNb/bgmQQ4XcQHuKyX9++2DHg4vnHCxnSos9M5PtJ2HEHgQvKy/uU5BL9EMCJBA/vRmJ87sBy+CbsAtlz3KYO3SMmLrS+dqUDM5nAsGSDtI2CezZT2aRTKFzZp7HTx8EJCDS2VfEkw2yElD08HkYkRjAGEgAOkTocOjy2zD1v3vjaPfTA7i2BBBnB4biA4nYZjApwCRIATJD3Uh1nkexydlDx56FmRjiZzYXnvnjOdwzv0Bk0B2mdWYwuWa1PVtzZnoBKeW6r9OeE+JnDyHVccbc4NKdDCpyHMCIJRE9YKl6y8aIGamTL3ceOIfs7B9VAoyGSQcEe6907dKR9QakkUTizAFAGEVGQL7LZm/Hmi2sGPfh7BecbwS6xXUWbPlGIrF8IGSXWuWs+HWfO7ELO94ASKk7n7NVwcWlxJkOJC91w3k3I0l0Joa2nQz3hGDO/lGZPxoA7IYCgPz2m7sux/TUVscbUAjJyyeQHugqLv/zdO1IHx7jmPnI1bt5XgE5gZnceEAWNLn6OkciuICTc54PCnf6Nz8VzOjaawknSNIQCO8+CpFMOdZ/Wuo9W/vO7kRW/NsGoJu31wSA3VAAMFKGkbowGHxNkIjYIBDxYSRO7ysm98HKKkdx3fKTOqMcrrBroXs4zKZRwMBcM53lSQTHncsGdshleGZnvhsEcEkJ8zPzesB8xQulpzp6EDt6Nmv8ETCUju36t4u72/MAMCEJkA8C8X93Hj2QNDL73AxJnH8berAXxSKtfgFI4QVF+gir/xrXRsYDMPrMd4MhXw3kX8u3+vNUwAgQUO7vAAJawwzw8sriDJiUCO08CD0UMSULAYY0ogeHLr+ZMDIJFDYAxw0A21oRAIyNpzqCXeHIi2AyTUwCCqCHexE/s6t4AGheBqW2Feay7HEYeGO6fqMHfgqFhUcCIe9avt4voAJyQOA2DEmCVBVlK9YWrUI5deUqIm8fy3Evw3ri7f93duchi/EZXCMANBYA3EAQAMSP957ekhSZA9lNHAQSZ3ZCH+4uygMxXzXKlj0G5vVnl2QX3Od/LAOwkHHnsvbJ1c4tGQoBIWc25xqEyFEBGFUSwJr9/iWr4Vu8uihjBSEQ3LoP+lDQMf6EFMmjw12vnI/0hyzm5+v/gjRWnbejwQ5fGUh9Yu1c1JR7HiAmOXGCTEcAzuGdtaIolTVK5Qww1YfM0DlAJJGzyoXGOJzeZpexOW/wAJzXsGfbml843zndJ+fr7P2tV8Rkb2Z9lX1m9+Ib57M0q3N9C1ah+oH/AF5WURT+J853YOClDRBp3YlZBFOJ3X954M1/6UtGogCSANLIrQS6LgC4R4VnhOi9d0njGk1js+2ZJSK90JoWggfqbvzJiEGtmQe1pg0iHYHMhAGZzr7FY7QDeWrBfQ4418h5oZSrjckp6x6A22CmkW+HslgrXZddbVzDTFyBWtOE8jseQtW9j41aMzBREqk0Bl54HcmLV0CWADekjO3pvfR3/3b27eMW81MwpcCYr4wZa9G/2xbQf7r7XP+n75v/rytaq29nDGUgQKSCiB37BdTa2SC1CFWDxKA1rYZatwR6+DKM8BXIdMyKtk2ACjWXNHob6WKtzGuf185pY0cI3RiQBOIqlIo6qPWt4IHqokhHm6IHjiJ29KQpHa31H4Op2Nb/dWTLbmR1v1v83xAA7Ed1MkrfemH/lh8+fd+blWXap0x9Skh1H0biwjb4F/9G0R6UFC/UmoVQa4r/TsLpSpm+AQxveAsyk4G9YjctjP7NnWd/3BEdDsMU+7bxN66w43iiEvaNDAD62xf6I3vO9f2zIY2ubOw+g/jJXyAzVMJ6gXc5yYyOoQ2bkerusdw+CUDKy9HhF79zYOMRmIwvCQDgupkOwPjdf9hxpCcU/wFIGnalrRHvRezY8xDp0q4feLdSZP8BRN45kKNNopnU4e+f2Pu8kDIBk/lpTID5wMReH5+zxjyp6+33LKtfpmlsru0KGbEeEOfQ6pcVVe+92ynZ0YH+n70EIxwFwEAgGEKGtnW1P/PsoR2HYRp9tuV/zchfPl3vcl86emk4ecfC2iuzm/z3c44K2582Qu3ggUYolbOnetxuCdJDQfQ//wLSVzpBVm5ZSsj20PC///7Gl1/ICCMBwJYAduRv3DSRzESORwBA/8zf7Nrf0R/9P5Jk0t5GXRoxxE78CJnBEhWOvItIpJIYeuM1JC+cAxhzEj7BdGLX3+7f8e+xTDqGXJ9/XC+MdtP1SIAcVXD8UvDCR9Y11fm9fBWsd+hKPQIjcglq3TIwrTjBj3cbSUNHcNMGhHftdLmbhETG6Hjh1PH//u8nDp1D1uefsO636YZ3fOgaTBiayk6tWVS9xKPRHDtyJ1KDELFOqLXLQWrptpm9JUkIhHdtRXDzr8x9GUAgCRhChnZ3Xvnef3trww5k9X4K40j6jEbF2PKD9p4ajC1qDZyZ3xJYp6pUT1Z8QCR6IBI9UGuWg5QSvmvgViIpEH57J4Y3/BIynQbAzGJVidTJ/oF//Nxrr7ykC2Hr/fyI35QAAADY63t7Bu5ZUXtpZoP3btMoNPsu4p0wEt1Qq5e9B4KxSAhE9u/A8IZXIJNJOEkQSUZHMPSTr7zx+r8MxOMRmMxPYmTGb8J0IwBw+3kSAP3src7OB9c19DTWeu42dxs1W4l4J4z4ZahVS0BqkYtJbxGSho7Ivi0IbnoVImEy30pNyO5I9Od/+utN//tkf/8QsjPfrfevm4q565MEQM9t7Gx/+O7G/rpq7U7O4bfr80SiC0bkPJTy+WCe0r58YrqRSCcR3vkGQtvfgEilTXdPEiBJ9kbjr39r87a/3tlxuRfmrL8hqz+figUApwNSQv5sc9e5h+6q76+v1tYxDr8ZIyCIVC/00DEwXzO4bwZKtlJiGpERCSK4+QVE3tlqGnw280GiNxJ/468273xm4/mLPTAZb8/+ojAfKK4EgN0Z3ZBYv7Hr7IfW1nU31Gh3cIUCZuqWIPUg9OBBENfAy9pANH1fEH2jlO5px/CGHyFx5lBOZlFKGN2h6Kvf/PWO/7nxXHsPsjrfnvnX5fIVolJt/CcNQ+JHb3Sev3dNzcXmes9KrlC1s2OmTMAIHYZMD4CXzQUpgRv/xWlE0sggfnIPgpt+jPTVy7DDuwBBSkpdGgr/5L++9tazO9s73WL/hi3+QlTCnR/NTj63obtj2bzyo60zvIs0jc2wXUTAgBE7ByNyDKTVgHubMfa2INOf9FAfwrteQmTf6zBiERBlX+ppGDJ08urgP335hU3fP351YAhZsW9n+UZd5Xu9VGoAAABe3drbU16mvL2oraze52XzQGCmh0OQmQHowbchM8Ngvlkg5db0EqSeQuLcPgS3/gjJ9qPWnr5mdI8kIZk2OnZc6H7m93664cXeSI6r59b5RWU+UFoAAC5RtW3/UPBiV3zPmqUV6fKAspRzeJ06O6RhxE5BDx801wh4Z4KYVuKuTRJJgXTfeUT2rEf04JsQkSHY/j2ZFUdiKJba/dz+M3/1Jy9v35E2coI8Rdf5+VTSDcCtw355sQZAra/W/P/6neUfXrui4ms+L1/u1F2ROVggBUr5CqgNj0GpXAtiJX5ZValISujBTsRPbUH83B6IWBhSckCQc2QyCLf3R55/5o0DP9xwsqMHJsPd+r5o1v5oVGoJAORmEWU8aYjn3ui5qKq0a/5sn+r38/mMkZat6BUQ6W4YoT0wYqdBTANpddNHIggDmeHLiB9/DZH965HqPAqZSQOUNfQgSYQTmaNbTnU+84UfbvnZ8e7BQYw09sas6S8GTYYj7i6w5jDrEDUA6vxWf+DZv1j4oduXV3yxzMdX52xHLi3MMC+4fxHU6g+BV94JpjWipHutXCfJTByZgbNItu9GqvMwjFgQUhBgzXppzfp0Rg5c6o28+Pcbj69/af/FTpjMtl28QiK/ZMwHJi8SY/+OvU5WQRYIyu98csbMrzzV8qk5M72/rWlsZCWJFAA4mKcZvPwOKJV3g/sXg5TKSXyEkSSNNIxIF9JXjyDVdQCZwXbIVAKQHFKSw3gSDLou4/2h1LY3D3X+6LuvHjwcT+m2dW/revest4s6Ssp8N2Mmi2xJYO2sAwWACkBVFNL+8um5ix5/qP7JpnrtY6rKmkc8vhSmZGA+ME8LeOA2KIFVYL4FYGodUGo1IQVEJgIj0gV98DTS/cegD7XDSITN17NI7sx0KUwjT9eRDEYy+/edHVj/P145vOv81bC9csee8e4y7pKL/EIMmWxyqwQbCKp1KJXlivebT7ctefi+mk801mkPayprsbbhsOrx7b1+rIM0kFoL7pkN5l8A5psH5mkBU2sBHrBsh+t4TKlD6gmIdBgi0Qs9chlG6AL0UAeMWB9kOgFpmEyHZKaQEmSuCxAEXUcsGMnsP3B+6OVnf3li98H2wSGYjE5jpLgvuIXbZDFjqsgNArdaUAHwMj/3/snvtc772IfrPtLS5HnY72WLGJHHXpSRBQMsMAjrdiqI+QGlCkypA6l1ILUWTKkClHLzO6aBrCURUgpA6JBGElKPQaTDkOlhiOQQRHIQIhmESEch9bQlnMm05h0RD9dnkqm07BsIpnbtPT34xt+/dvrgyStBe6MGe7bbh1vcTzrj3UyYSnLbBm6X0QECAPWJjzY0/udPNK1dPM//YHWFuk5VaQazXy4rXXv4uFdySWnu7CXt65ZBBgYpnTw7IGC2E+YhhXT2CZKSAMlMt01ahpzrrw0AQ0c4EjNOdVyNb9twoGfHDzacvzgcTdtLtN1Mt2e8beRNmq4fiwFTTflqwW0j2Aevq1F9v/tE86yH3l9zx5wW7z2VAWWlprKZjJH5alRJJhjylm1JGwQWY3Ovuc5F3neWSIc9y602woCRyWAoFjfOdQ8k33nn1NC+n2zpOHvo/HAQ2XX57mVa+YyfEnE/2sDfTJS/5tecshYAXH95VYXi/eRv1Dc+8L6aBQvm+G+rq1KX+318rqpQAyMWIAInZyYjDxyFQGB+TzbTLQAIASkMJPUMhuNJ0RkMZ85cvpo4tu/k8KlXdnR1nr4ciSDLYD3vyN+g6aZhvHvAb0bKB4JbKuQfDIDSWKf5PnxPdfWdKyub57X6ZjXUaq0VZUqLV2MNmsJrOKdyRuQjkEYAhyQGSSQlBASEEJQxDCQNXcYyGRlKJuVANG70DA5nrly+mrhy5Fy4e/uhgYET7ZGoENKtw23GGxi5K9dNy3j3QN/MlLPyH65toJBlfj4YHMAQQW2s07R5s/zeWc1eX0ON5q0MKB6fl6sqZwoB0HUpkymRCceM9GAwk+ruSyYudSdSl68mUqm0KBSRczPeyDu32+Ubdjcd4/MH+GYnKvCXFfg72kGj3COfcsxIuHZIGeWQBf4C04Dx+QM7nagQIwsd19pXJP9ehRiXf4hRrk87phcazOlKhZg5GkBGa2+TLPD5WgyWo/zvtKLpDoDxPNNY5/kkJ3g+relWBEAxnveWYvJ79B6NSv8f9yik2kavriYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDUtMTVUMTM6MzQ6MDYrMDI6MDClwEwSAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA1LTE1VDEzOjM0OjA2KzAyOjAw1J30rgAAAABJRU5ErkJggg=='),
        buttons: []
      })
    }
  })
}

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Back',
        accelerator: 'Backspace',
        enabled: false,
        click () {
          sendAction('go-back')
          const win = BrowserWindow.getAllWindows()[0]
          if (win.webContents.canGoBack()) {
            win.webContents.goBack()
          }
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Home',
        accelerator: 'CmdOrCtrl+1',
        click () {
          sendAction('navigate-home')
        }
      },
      {
        label: 'Discover',
        accelerator: 'CmdOrCtrl+2',
        click () {
          sendAction('navigate-discover')
        }
      },
      {
        label: 'Upload',
        accelerator: 'CmdOrCtrl+3',
        click () {
          sendAction('navigate-upload')
        }
      },
      {
        label: 'Notifications',
        accelerator: 'CmdOrCtrl+4',
        click () {
          sendAction('navigate-notifications')
        }
      },
      {
        label: 'Profile',
        accelerator: 'CmdOrCtrl+5',
        click () {
          sendAction('navigate-profile')
        }
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click () {
          sendAction('toggle-dark-mode')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        label: 'Scroll a post up',
        accelerator: 'Shift+Up',
        click () {
          sendAction('navigate-up')
        }
      },
      {
        label: 'Scroll a post down',
        accelerator: 'Shift+Down',
        click () {
          sendAction('navigate-down')
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click () {
          sendAction('toggle-dark-mode')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const applicationMenu = Menu.buildFromTemplate(template)
export { applicationMenu as default }
