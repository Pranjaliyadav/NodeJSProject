const deleteProduct = (btn) =>{
    const prodId = btn.parentNode.querySelector('[name=productId]').value
    console.log('deleteee product,', prodId)
    const productElement = btn.closest('article')
    fetch('/admin/product/'+ prodId,{
        method : 'DELETE',
        headers : {},
    }) 
    .then(
      result => {
       
          return result.json()
        
      }  
    )
    .then(
        result => {
            console.log(result)
            productElement.parentNode.removeChild(productElement)
        }  
      )
    .catch(err => {
        console.log(err)
    })
}