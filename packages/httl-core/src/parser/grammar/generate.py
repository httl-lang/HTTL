import subprocess
import shutil
import os
import sys

os.chdir(os.path.dirname(__file__))

print(f"Generation mode: {sys.argv}")

gen_mode = sys.argv[1] if len(sys.argv) > 1 else ""


def remove_folder(folder_path):
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        shutil.rmtree(folder_path)
        print(f"Removed folder: {folder_path}")
    else:
        print(f"Folder does not exist: {folder_path}")


def run(command):
    process = subprocess.run(command, shell=True, check=True)
    if process.returncode != 0:
        print(f"Command failed: {command}")


def generate_grammar():
    antlr_folder = "../antlr"

    remove_folder(antlr_folder)

    run(f"antlr4 -Dlanguage=TypeScript -o {antlr_folder} HttlLexer.g4")
    run(f"antlr4 -Dlanguage=TypeScript -o {antlr_folder} -visitor HttlParser.g4")

    # Copy HttlLexerBase.ts to antlr folder
    shutil.copy("../HttlParserBase.ts", antlr_folder)
    shutil.copy("../HttlLexerBase.ts", antlr_folder)


def generate_debug_grammar(debug_file: str):
    antlr_folder = "./debug/_antlr"

    remove_folder(antlr_folder)

    run(f"antlr4 -o {antlr_folder} HttlLexer.g4")
    run(f"antlr4 -o {antlr_folder} HttlParser.g4")

    # Copy HttlLexerBase.java to antlr folder
    shutil.copy("./debug/HttlParserBase.java", antlr_folder)
    shutil.copy("./debug/HttlLexerBase.java", antlr_folder)

    run(
        f'cd {antlr_folder} && javac -cp ".;c:\\Program Files\\ANTLR\\antlr-4.13.2-complete.jar" Httl*.java'
    )
    run(f"cd {antlr_folder} && grun Httl program -tokens -gui {debug_file}")


if gen_mode == "--debug":
    debug_file = sys.argv[2] if len(sys.argv) > 2 else "../../samples/sample.httl"
    generate_debug_grammar(debug_file)
    sys.exit(0)


generate_grammar()

# // Rename the generated files to .ts
# fs.readdirSync('./src/parser/antlr').forEach(file => {
#   if (file.endsWith('.js')) {
#     const content = fs.readFileSync(`./src/parser/antlr/${file}`, 'utf8');
#     const modifiedContent = `// @ts-nocheck\r\n` + content.replace(".js", "");

#     fs.writeFileSync(`./src/parser/antlr/${file}`, modifiedContent, 'utf8');

#     const oldPath = `./src/parser/antlr/${file}`;
#     const newPath = `./src/parser/antlr/${file.replace('.js', '.ts')}`;
#     fs.renameSync(oldPath, newPath);
#   }
# });

# for file in os.listdir(antlr_folder):
#     if file.endswith('.js'):
#         file_path = os.path.join(antlr_src_folder, file)
#         with open(file_path, 'r', encoding='utf8') as f:
#             content = f.read()

#         modified_content = "// @ts-nocheck\r\n" + content.replace(".js", "")

#         with open(file_path, 'w', encoding='utf8') as f:
#             f.write(modified_content)

#         new_file_path = os.path.join(antlr_src_folder, file.replace('.js', '.ts'))
#         os.rename(file_path, new_file_path)
