Rails.application.routes.draw do
  resources :tasks
  resources :pomodori, except: [:edit, :update, :destroy]
  root 'welcome#index'
end
