require 'rake/minify'
require 'sass'
require 'fileutils'

Rake::Minify.new(:minify_and_combine_js) do
  dir("#{Dir.pwd}/") do
    group("quiz-min.js") do
      add("js/quiz.js")
      add("js/notation.js")
      add("js/note.js")
      add("js/keyboard.js")
    end
  end
end

task :minify_css do
  css_file_in = File.read("keyboard.css")
  engine = Sass::Engine.new(css_file_in, syntax: :scss, style: :compressed)
  css_file_out = File.new("keyboard-min.css", "w")
  css_file_out.write(engine.render)
  css_file_out.close
end

task :copy_to_google do
  destination = "~/Google Drive/Note-Recognition/"
  cp("keyboard-min.css", destination)
  cp("quiz-min.js", destination)
  cp("blog.html", destination)
  cp("note_on_staff.svg", destination)
end

task :default => [:minify_and_combine_js, :minify_css, :copy_to_google]
