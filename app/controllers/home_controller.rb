class HomeController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :redirect_signed_in, only: [:index]

  def index
  end

  private

  def redirect_signed_in
    redirect_to dashboard_path if user_signed_in?
  end
end
