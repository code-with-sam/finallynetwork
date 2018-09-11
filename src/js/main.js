import $ from 'jquery'
console.log('hello')

$('.header__beta').on('click', () => {
  $('.modal').fadeIn()
})
$('.modal .submit').on('click', (e)=> {
  let username = $('.modal .username').val()

  window.location.href = `/@${username}`
  console.log('hello')
  e.preventDefault()
})
