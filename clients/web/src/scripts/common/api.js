/* fonction asynchrine puisque qu'il va aller recup l'url qu'on va lui passer, qu'il va ensuite manipuler et nous le retourner sous la forme d'un tableau */

// Get pictures list content from API
export const getPixList = async (url, pixlist) => {
    return window
      .fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // map transforme le tableau/objet json
        pixlist.list = data.map((obj) => {
          return {
            id: obj.id,
            author: obj.author,
            thumb: `https://picsum.photos/id/${obj.id}/300/300`
          }
        })
      })
  }
  