Rails.application.routes.draw do
  resources :pomodori
  root 'welcome#index'
end
