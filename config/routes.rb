Rails.application.routes.draw do
  resources :pomodori, except: [:edit, :update, :destroy]
  root 'welcome#index'
end
